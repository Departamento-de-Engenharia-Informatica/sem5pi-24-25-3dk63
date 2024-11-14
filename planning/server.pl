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

:- set_setting(http:cors, [*]).

:- dynamic cookie_value/1.

:- dynamic fetch_all_surgery_rooms/1.
:- dynamic fetch_all_staffs/1.

% Define URL base para a API com HTTPS e porta 5001
api_url('https://localhost:5001/api').

% Defina as rotas da API
http:location(api, root(api), []).
:- http_handler(api(route), api_get_route, []).
:- http_handler(api(sequence), api_get_requests, []).
:- http_handler(api(surgery_rooms), api_get_surgery_rooms, []).

% Função para configurar o valor do cookie
% set_cookie_value(Value) :-
%     (retract(cookie_value(_)); true),
%     assertz(cookie_value(Value)).

% Função para ler dados da API utilizando cookies
read_api(Url, Dict) :-
    %cookie_value(CookieValue),
    setup_call_cleanup(
        http_open(Url, In, [
            %request_header("Cookie"=CookieValue),
            cert_verify_hook(cert_accept_any) % Aceitar qualquer certificado (use com cautela em produção)
        ]),
        json_read_dict(In, Dict),
        close(In)
    ).

% Função para obter claims do usuário autenticado
% fetch_user_claims(Role, Email, Active, UserId) :-
%     api_url(Url),
%     atom_concat(Url, '/claims', ClaimsUrl),
%     read_api(ClaimsUrl, JsonOut),
%     member(Claim, JsonOut),
%     ( Claim.get('Type') == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" -> Role = Claim.get('Value') ; true ),
%     ( Claim.get('Type') == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress" -> Email = Claim.get('Value') ; true ),
%     ( Claim.get('Type') == "Active" -> Active = Claim.get('Value') ; true ),
%     ( Claim.get('Type') == "UserId" -> UserId = Claim.get('Value') ; true ).

% Exemplo de função para usar claims no seu código
% api_get_route(Request) :-
%     authenticate(),
%     fetch_user_claims(Role, Email, Active, UserId),
%     format('Role: ~w, Email: ~w, Active: ~w, UserId: ~w', [Role, Email, Active, UserId]),
%     reply_json(json([role=Role, email=Email, active=Active, userId=UserId]), [json_object(dict)]).

% % Função de autenticação com API para gerar um cookie (exemplo)
% authenticate() :-
%     api_url(Url),
%     atom_concat(Url, '/users/login', AuthUrl),
%     email(Email),
%     password(Pass),
%     JsonData = json([email=Email, password=Pass]),
%     post_api(AuthUrl, JsonData, Out),
%     set_cookie_value(Out.token).

% Função para buscar todas as salas de cirurgia
fetch_all_surgery_rooms(SurgeryRooms) :-
    api_url(BaseUrl),
    atom_concat(BaseUrl, '/SurgeryRoom', Url),
    read_api(Url, SurgeryRooms).

% Função para buscar todas as staffs
fetch_all_staffs(Staffs) :-
    api_url(BaseUrl),
    atom_concat(BaseUrl, '/Staff/search', Url),
    read_api(Url, Staffs).

% Função para buscar operations request
fetch_all_operations_request(OpRequests) :-
    api_url(BaseUrl),
    atom_concat(BaseUrl, '/OperationRequest', Url),
    read_api(Url, OpRequests).

% Rota para buscar todas as salas de cirurgia e retornar como JSON
api_get_surgery_rooms(_Request) :-
    fetch_all_surgery_rooms(SurgeryRooms),
    reply_json(SurgeryRooms, [json_object(dict)]).

% Rota para buscar todas os staffs e retornar como JSON
api_get_staffs(_Request) :-
    fetch_all_staffs(Staffs),
    reply_json(Staffs, [json_object(dict)]).

% Rota para buscar todas os staffs e retornar como JSON
api_get_operation_requests(_Request) :-
    fetch_all_operations_request(OpRequests),
    reply_json(OpRequests, [json_object(dict)]).

% Função para inicializar o servidor
init_server(Port) :-
    debug(http(request)),
    http_server(http_dispatch, [port(Port)]).

:- init_server(4000).
