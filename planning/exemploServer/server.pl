:- module(server, []).

:- use_module(planning).
:- use_module(genetic).

:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/html_write)). % produce html
:- use_module(library(http/http_parameters)). % GET query params
:- use_module(library(http/html_head)).
:- use_module(library(http/http_cors)).
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_open)).
:- use_module(library(http/http_client)).
:- use_module(library(http/json)).
% :- use_module(library(http/http_files)).

:- set_setting(http:cors, [*]).

% to reload, use make. in the console & refresh the page

:- json_object student(student_name:string).

api_url('http://localhost:4000/api').

% define route aliases
http:location(api, root(api), []). % /api

% define your routes here
:- http_handler(api(route), api_get_route, []). % /api/route?fromX=xx&fromY=yy&fromFloor=abc&toX=xx&toY=yy&toFloor=cba&method=elevators
:- http_handler(api(sequence), api_get_requests, []). % /api/sequence?deviceId=xx

:- dynamic bearer_token/1.

read_api(Url, Dict):-
    bearer_token(T),
    setup_call_cleanup(
        http_open(Url, In, [
            authorization(bearer(T))
        ]),
        json_read_dict(In, Dict),
        close(In)
    ).

%read_api(Url, Dict):-
%    setup_call_cleanup(
%        http_open(Url, In, []),
%        json_read_dict(In, Dict),
%        close(In)
%    ).

post_api(Url, Data, Dict):-
        http_post(Url, json(Data), json(Dict), [method(post)]).

fetch_buildings(Buildings):-
    api_url(Url),
    atom_concat(Url, '/buildings?limit=100000', BuildingsUrl),
    read_api(BuildingsUrl, B),
    Buildings = B.data.

fetch_connectors(Connectors):-
    api_url(Url),
    atom_concat(Url, '/connectors?limit=100000', ConnectorsUrl),
    read_api(ConnectorsUrl, C),
    Connectors = C.data.

fetch_floors(BuildingCode, Floors) :-
    api_url(Url),
    atom_concat(Url, '/buildings/', FloorsUrl),
    atom_concat(FloorsUrl, BuildingCode, FloorsUrl2),
    atom_concat(FloorsUrl2, '/floors', FloorsUrl3),
    read_api(FloorsUrl3, Floors).

fetch_requests(DeviceId,Requests) :-
    api_url(Url),
    atom_concat(Url, '/tasks', Url2),
    atom_concat(Url2, '?filter=device&value=', Url3),
    atom_concat(Url3, DeviceId, PickDeliveryUrl),
    (retractall(genetic:t(_,_,_));true),
    (retractall(genetic:tarefas(_,_,_));true),
    (retractall(genetic:distancias_robot_tarefa(_,_));true),
    (retractall(genetic:distancias_tarefa_robot(_,_));true),
    (retract(genetic:n_tarefas(_));true),
    read_api(PickDeliveryUrl, Requests).

password('admin').
email('admin@isep.ipp.pt').

authenticate():-
    api_url(Url),
    atom_concat(Url, '/users/login', AuthUrl),
    email(Email),
    password(Pass),
    JsonData = json([email=Email, password=Pass]),
    post_api(AuthUrl, JsonData, Out),
    (retract(bearer_token(_));true), assertz(bearer_token(Out.token)), !.

api_get_requests(Request):-
    authenticate(),
    planning:load_data(),
    http_parameters(Request, [ deviceId(DeviceId, [ string ]) ]),
    fetch_requests(DeviceId,Requests),
    genetic:load_tasks(Requests.data,0),
    genetic:gera_lim_time(B*X),
    prolog_to_json(json([tasks=B, time=X]), JsonOut),
    reply_json(JsonOut, [json_object(dict)]).

api_get_route(Request):-
    authenticate(),
    (retractall(planning:m(_,_,_,_));true),
    (retractall(planning:liga(_,_));true),
    (retractall(planning:pisos(_,_));true),
    (retractall(planning:elevador(_,_));true),
    (retractall(planning:corredor(_,_,_,_));true),
    (retractall(planning:exit(_,_,_,_));true),
    planning:load_data(),
    http_parameters(Request, [ fromX(FromX, [ integer ]) ]),
    http_parameters(Request, [ fromY(FromY, [ integer ]) ]),
    http_parameters(Request, [ fromFloor(FromFloor, [ string ]) ]),
    http_parameters(Request, [ toX(ToX, [ integer ]) ]),
    http_parameters(Request, [ toY(ToY, [ integer ]) ]),
    http_parameters(Request, [ toFloor(ToFloor, [ string ]) ]),
    http_parameters(Request, [ method(Met, [ optional(false), length >= 1 ]) ]),
    get_path(FromX, FromY, FromFloor, ToX, ToY, ToFloor, Met, R),

    cells_to_json(R, R2),
    prolog_to_json(R2, JsonOut),
    reply_json(JsonOut, [json_object(dict)]).

get_path(FromX, FromY, FromFloor, ToX, ToY, ToFloor, Met, R):-
    Met=='elevators',
    planning:caminho_celulas_elevador(cel(FromFloor, FromX, FromY), cel(ToFloor, ToX, ToY), R,_).
get_path(FromX, FromY, FromFloor, ToX, ToY, ToFloor, Met, R):-
    Met=='connectors',
    planning:caminho_celulas_edificios(cel(FromFloor, FromX, FromY), cel(ToFloor, ToX, ToY), R,_).


cell_to_json(cel(Floor, X, Y), JsonOut):-
    JsonOut = json([floor=Floor, x=X, y=Y]).
cell_to_json(elev(F1, F2), JsonOut):-
    JsonOut = json([floor1=F1, floor2=F2,type=elevator]).
cell_to_json(cor(F1, F2), JsonOut):-
    JsonOut = json([floor1=F1, floor2=F2,type=connector]).
cells_to_json([], []).
cells_to_json([H|T], [H2|T2]):-
    cell_to_json(H, H2),
    cells_to_json(T, T2).

init_server(Port):-
    debug(http(request)), % debug http requests & responses
    http_server(http_dispatch, [port(Port)]).

:- init_server(5000).
