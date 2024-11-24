:- module(server, [server/1]).

% Import planning module explicitly
:- use_module(planning, [obtain_better_sol/5]).

% HTTP Libraries
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_client)).
% JSON Libraries
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json)).

% JSON object definition
:- json_object
    planning_request(roomId:dict, date:dict, operationRequestIds:list),
    planning_response(success:boolean, roomId:atom, date:atom, appointments:list, staffSchedules:list, finishTime:integer).

% Define HTTP handlers
:- http_handler('/api/planning/plan', handle_planning_request, []).

% Server initialization
server(Port) :-
    write('Starting server on port '), writeln(Port),
    http_server(http_dispatch, [port(Port)]).

% Main request handler
handle_planning_request(Request) :-
    write('Handling planning request...'), nl,
    % Log the full request information
    writeln(Request),

    % Reading and parsing the JSON data from the request
    (   http_read_json(Request, JSONIn)
    ->  writeln('Successfully read JSON:'),
        writeln(JSONIn),
        catch(
            process_planning(JSONIn),
            Error,
            handle_error(Error)
        )
    ;   writeln('Error reading JSON data!'),
        handle_error(error(json_error('Failed to parse JSON'), _))
    ).

% Process the planning request data
process_planning(JSONIn) :-
    writeln('Processing planning...'),

    % Extract values from parsed JSON
    (   get_dict(roomId, JSONIn, RoomIdDict),
        get_dict(value, RoomIdDict, RoomId),
        get_dict(date, JSONIn, DateDict),
        get_dict(value, DateDict, DateStr),
        get_dict(operationRequestIds, JSONIn, OperationRequests)
    ->  writeln('Extracted values:'),
        writeln([RoomId, DateStr, OperationRequests]),

        % Convert date
        atom_string(DateAtom, DateStr),
        atom_number(DateAtom, DateNum),
        write('Converted date: '), writeln(DateNum),

        % Extract operation IDs
        maplist(get_op_id, OperationRequests, OperationIds),
        write('Operation IDs: '), writeln(OperationIds),

        % Call planning module
        (   planning:obtain_better_sol(RoomId, DateNum, AgendaRoom, StaffAgendas, FinishTime)
        ->  write('Planning solution found...'), nl,
            create_response(RoomId, DateStr, AgendaRoom, StaffAgendas, FinishTime, Response),
            writeln('Sending response...'),
            reply_json(Response, [json_object(dict)])
        ;   throw(planning_failed)
        )
    ;   throw(error(missing_field, 'Required fields are missing in the JSON data'))
    ).

% Helper to extract operation ID
get_op_id(OpReq, Id) :-
    get_dict(value, OpReq, Id),
    write('Extracted operation ID: '), writeln(Id).

% Create response JSON
create_response(RoomId, DateStr, AgendaRoom, StaffAgendas, FinishTime, Response) :-
    write('Creating response JSON...'), nl,
    appointments_to_json(AgendaRoom, AppointmentsJson),
    staff_schedules_to_json(StaffAgendas, StaffJson),
    Response = json([
        success = true,
        roomId = RoomId,
        date = DateStr,
        appointments = AppointmentsJson,
        staffSchedules = StaffJson,
        finishTime = FinishTime
    ]).

% Error handlers
handle_error(error(json_error(Type, _), _)) :-
    write('Handling JSON error...'), nl,
    Response = json([
        success = false,
        error = Type
    ]),
    reply_json(Response, [status(400)]).

handle_error(planning_failed) :-
    write('Handling planning failure...'), nl,
    Response = json([
        success = false,
        error = "Failed to generate planning solution"
    ]),
    reply_json(Response, [status(404)]).

handle_error(error(MissingField, _)) :-
    write('Handling missing field error...'), nl,
    Response = json([
        success = false,
        error = 'Missing required field: ' + MissingField
    ]),
    reply_json(Response, [status(400)]).

handle_error(Error) :-
    write('Handling unexpected error...'), nl,
    Response = json([
        success = false,
        error = "Unexpected error"
    ]),
    reply_json(Response, [status(500)]).

% JSON conversion helpers
appointments_to_json([], []).
appointments_to_json([(StartTime, EndTime, OpCode)|Rest], [AppJson|RestJson]) :-
    AppJson = json([
        operationRequestId = OpCode,
        startTime = StartTime,
        endTime = EndTime
    ]),
    appointments_to_json(Rest, RestJson).

staff_schedules_to_json([], []).
staff_schedules_to_json([(StaffId, Agenda)|Rest], [StaffJson|RestJson]) :-
    appointments_to_json(Agenda, StaffAppointments),
    StaffJson = json([
        staffId = StaffId,
        schedule = StaffAppointments
    ]),
    staff_schedules_to_json(Rest, RestJson).
