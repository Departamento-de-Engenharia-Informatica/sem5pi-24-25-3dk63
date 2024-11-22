:- module(server, []).

:- use_module(planning).


:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/html_write)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/html_head)).
:- use_module(library(http/http_cors)).
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_open)).
:- use_module(library(http/http_client)).
:- use_module(library(http/json)).

% Enable CORS
:- set_setting(http:cors, [*]).

% API routes
:- http_handler('/api/planning/plan', handle_planning_request, []).

% Main planning handler
handle_planning_request(Request) :-
    http_read_json_dict(Request, Data),

    % Extract data from nested JSON request
    RoomId = Data.get(roomId).get(value),
    DateDict = Data.get(date).get(value),

    % Convert date string to number format
    atom_string(DateAtom, DateDict),
    atom_number(DateAtom, DateNum),

    % Call the planning module's obtain_better_sol
    obtain_better_sol(RoomId, DateNum, AgendaRoom, StaffAgendas, FinishTime),

    % Convert results to JSON
    appointments_to_json(AgendaRoom, AppointmentsJson),
    staff_schedules_to_json(StaffAgendas, StaffJson),

    JsonResponse = json{
        roomId: RoomId,
        date: DateDict,
        appointments: AppointmentsJson,
        staffSchedules: StaffJson,
        finishTime: FinishTime
    },

    reply_json(JsonResponse).

% Convert agenda room entries to JSON appointments
appointments_to_json([], []).
appointments_to_json([(StartTime, EndTime, OpCode)|Rest], [AppJson|RestJson]) :-
    AppJson = json{
        operationRequestId: OpCode,
        startTime: StartTime,
        endTime: EndTime
    },
    appointments_to_json(Rest, RestJson).

% Convert staff schedules to JSON
staff_schedules_to_json([], []).
staff_schedules_to_json([(StaffId, Agenda)|Rest], [StaffJson|RestJson]) :-
    appointments_to_json(Agenda, StaffAppointments),
    StaffJson = json{
        staffId: StaffId,
        schedule: StaffAppointments
    },
    staff_schedules_to_json(Rest, RestJson).

% Server management predicates
stop_server :-
    (   http_server_property(Port, port(_))
    ->  http_stop_server(Port, [])
    ;   true
    ).

start_server(Port) :-
    stop_server,
    http_server(http_dispatch, [port(Port)]).