%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%Servidor

% Gerir servidor
startServer(Port) :-
    http_server(http_dispatch, [port(Port)]),
    asserta(port(Port)).

stopServer:-
    retract(port(Port)),
    http_stop_server(Port,_).

% Funções do Servidor
:- set_setting(http:cors, [*]).

:- http_handler('/rooms',get_all_divisions,[]).
get_all_divisions(Request):-
    cors_enable(Request, [methods([get])]),
    findall(D, sistema_pericial:facto(_,fazer_divisao(D)), R),
    prolog_to_json(R, JSONObject),
    reply_json(JSONObject, [json_object(dict)]).

:- http_handler('/notifications',get_all_notifications,[]).
get_all_notifications(Request):-
    cors_enable(Request, [methods([get])]),
    findall(N, (sistema_pericial:notificacao(TimeStamp, Notification),
    string_concat(TimeStamp," - ",A), string_concat(A,Notification,N)), R),
    prolog_to_json(R, JSONObject),
    reply_json(JSONObject, [json_object(dict)]).

:- http_handler('/Preference', receive_survey,[]).
receive_survey(Request):-
	((
		option(method(options), Request),!,cors_enable(Request,[methods([get,post,delete])]),format('~n')
	);(
    cors_enable(Request,[ methods([get,post,delete,options])]),
    http_read_json(Request, Dict,[json_object(term)]),
	Dict=json([user=U,division=D,temperature=T,luminosity=L,preference=P]),
	assertz(survey(U,D,T,L,P)), atom_number(T, T1), atom_number(L, L1),
	sistema_pericial:atualiza_factos_questionario(U,D,T1,L1,P),
    reply_json("{ response: Survey submitted sucessfully}"))).


%Métodos que iniciam automaticamente
inicializar_sistema:-
	carrega_bc,
	carrega_factos,
	gerar_metaconhecimento,
	obter_ultimas_regras,
	menu,!.

inicializar_server:-
    startServer(5000),!,
    inicializar_sistema,!.

:- inicializar_server.