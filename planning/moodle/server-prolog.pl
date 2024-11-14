%% Base Conhecimento secundaria
:- dynamic melhor_sol_to/2.
:- dynamic melhor_sol_to_cr/4.
:- dynamic melhor_sol_to_edd/2.
:- dynamic classif_operacoes/2.
:- dynamic operacoes_atrib_maq/2.
:- dynamic op_prod_client/9.
:- dynamic id_tmp/1.
:- dynamic tarefas/1.
:- dynamic tarefa/4.
:- dynamic menor_deslocamento/1.
:- dynamic tarefa_encomenda/5.
:- dynamic tarefa_op/2.
:- dynamic maior_tempo_execucao/2.
:- dynamic menor_tempo_amplitude/1.
:- dynamic melhor_sol_linha/3.
:- dynamic agenda_maq/2.
:- dynamic tarefa_makespan/1.

%% Base Conhecimento principal
:- dynamic ferramentas/1.
:- dynamic tipo_operacoes/1.
:- dynamic linhas/1.
:- dynamic prioridade_cliente/2.
:- dynamic maquinas/1.
:- dynamic produtos/1.
:- dynamic e/3.
:- dynamic clientes/1.
:- dynamic operacoes_produto/2.
:- dynamic tipos_maq_linha/2.
:- dynamic operacao_maquina/5.
:- dynamic encomenda/2.

%% Nossos modules
:- use_module(m_tempo_ocupacao_perm_findall).
:- use_module(m_tempo_ocupacao_perm_sem_findall).
:- use_module(h_m_tempo_ocupacao).
:- use_module(m_tempo_atraso_perm_findall).
:- use_module(m_tempo_atraso_perm_sem_findall).
:- use_module(h_m_tempo_atraso).
:- use_module(aStar_tempo_ocupacao).
:- use_module(aStar_tempo_atraso).
:- use_module(h_m_tempo_atraso_edd).
:- use_module(gera).
:- use_module(gera_tempo_execucao).
:- use_module(makespan).
:- use_module(gera_valor_indicado).
:- use_module(gera_nao_optimizado).
:- use_module(h_m_tempo_atraso_edd_ag).
:- use_module(geraOrdemIdeal).
:- use_module(criar_agendas_maq).

% Bibliotecas 
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_unix_daemon)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_open)).
:- use_module(library(http/http_cors)).
:- use_module(library(date)).
:- use_module(library(random)).
% Bibliotecas JSON
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json)).

:- json_object agenda_maq_json_array(array:list(agenda_maq_json)).
:- json_object agenda_maq_json(maquina:string,agenda_array:list(agenda_json)).
:- json_object agenda_json(instanteInicial:float,instanteFinal:float,tipoProcessamento:string,lista:list(string)).

%Cors
:- set_setting(http:cors, [*]).
% Relacao entre pedidos HTTP e predicados que os processam
:- http_handler('/api/pp/obterAgendaMaquinas', obter_agenda_maquinas, []).

operacoes_url("https://lei19-20-s5-3dc-04-rest-mdf-api.azurewebsites.net/api/mdf/operacao").
maquina_url("https://lei19-20-s5-3dc-04-rest-mdf-api.azurewebsites.net/api/mdf/maquina/maquinasLigadas").
linhaProducao_url("https://lei19-20-s5-3dc-04-rest-mdf-api.azurewebsites.net/api/mdf/linhaDeProducao/linhasComMaquinasLigadas").
tiposMaquina_url("https://lei19-20-s5-3dc-04-rest-mdf-api.azurewebsites.net/api/mdf/tipomaquina").
produtos_url("https://lei19-20-s5-3dc-04-rest-mdp-api.azurewebsites.net/api/mdp/produto").
clientes_url("https://rest-ge-api.herokuapp.com/cliente").
encomendas_cliente_url("https://rest-ge-api.herokuapp.com/encomenda/cliente/").

obterClientes(Data) :-
    clientes_url(URL),
    setup_call_cleanup(
        http_open(URL, In, [request_header('Accept'='application/json'),request_header('token'='pp_token'),request_header('email'='admin@admin.com')]),
        json_read_dict(In, Data),
        close(In)
    ).

obterOperacoes(Data) :-
    operacoes_url(URL),
    setup_call_cleanup(
        http_open(URL, In, [request_header('Accept'='application/json')]),
        json_read_dict(In, Data),
        close(In)
    ).

obterMaquinas(Data) :-
    maquina_url(URL),
    setup_call_cleanup(
        http_open(URL, In, [request_header('Accept'='application/json')]),
        json_read_dict(In, Data),
        close(In)
    ).    

obterTiposMaquina(Data) :-
    tiposMaquina_url(URL),
    setup_call_cleanup(
        http_open(URL, In, [request_header('Accept'='application/json')]),
        json_read_dict(In, Data),
        close(In)
    ).  

obterProdutos(Data) :-
    produtos_url(URL),
    setup_call_cleanup(
        http_open(URL, In, [request_header('Accept'='application/json')]),
        json_read_dict(In, Data),
        close(In)
    ).  

obterLinhasDeProducao(Data) :-
    linhaProducao_url(URL),
    setup_call_cleanup(
        http_open(URL, In, [request_header('Accept'='application/json')]),
        json_read_dict(In, Data),
        close(In)
    ).    

adicionarEncomendas():-
            obterClientes(Data),
            parse_encomendas(Data).

parse_encomendas([]).
parse_encomendas([H|List]):-
    encomendas_cliente_url(URL_Base),
    atom_concat(URL_Base,H.get(email),URL),
    setup_call_cleanup(
        http_open(URL, In, [request_header('Accept'='application/json'),request_header('token'='pp_token'),request_header('email'='admin@admin.com')]),
        json_read_dict(In, Data),
        close(In)
    ),
    asserta_encomendas(Data,Encomendas),
    asserta(encomenda(H.get(email),Encomendas)),
    parse_encomendas(List).  

asserta_encomendas([],[]).
asserta_encomendas([H|Data],[e(H.get(idProduto),H.get(quantidade),TempoConclusao)|Encomendas]):-
            Status=H.get(status),
            atom_string(Status,StringStatus),
            StringStatus=="Por processar",
            split_string(H.get(data),"\s","",L),
            virgula(L,Date),
            atom_concat(Date,' 15:29:44 GMT',DateComplete),
            parse_time(DateComplete,rfc_1123,Stamp),
            get_time(TempoAtual),
            TempoConclusao is Stamp-TempoAtual,
            asserta_encomendas(Data,Encomendas).

asserta_encomendas([_|Data],Encomendas):-asserta_encomendas(Data,Encomendas).

virgula([H|List],Virg):-
            atom_concat(H,', ',Conc),
            swap(List,List2),
            atomic_list_concat(List2,' ',Conc2),
            atom_concat(Conc,Conc2,Virg).

swap([X,Y|T],[Y,X|T]).
swap([Z|T1],[Z|T2]) :- swap(T1,T2),!.

adicionarClientes():-
            obterClientes(Data),
            parse_clientes(Data,Lids),
            asserta(clientes(Lids)).

parse_clientes([],[]).
parse_clientes([H|Data],[H.get(email)|Lids]):-
    random(0,30,Random),
    asserta(prioridade_cliente(H.get(email),Random)),
    parse_clientes(Data,Lids).  

adicionarProduto():-
            obterProdutos(Data),
            parse_produtos(Data,Lids),
            parse_produtos_operacoes(Data),
            asserta(produtos(Lids)).

parse_produtos([],[]).
parse_produtos([H|Data],[H.get(idProduto)|Lids]):-
    parse_produtos(Data,Lids).    

parse_produtos_operacoes([]).
parse_produtos_operacoes([H|Data]):-
    operacoes_produto_lista(H.get(listaOrdens),Lids),
    obterTiposEferramentasOperacoes(Lids,_,Lopts),
    removerRepetidos(Lopts,LoptsNRep),
    asserta(operacoes_produto(H.get(idProduto),LoptsNRep)),
    parse_produtos_operacoes(Data).  

operacoes_produto_lista([],[]).
operacoes_produto_lista([H|ListaOrdens],[H.get(idOperacao)|Lids]):-
    operacoes_produto_lista(ListaOrdens,Lids).   

adicionarOperacoes() :-
    obterOperacoes(Data),
    parse_operacoes(Data,Lids),
    obterTiposEferramentasOperacoes(Lids,Lfer,Lopts),
    removerRepetidos(Lfer,LferNRep),
    asserta(ferramentas(LferNRep)),
    removerRepetidos(Lopts,LoptsNRep),
    asserta(tipo_operacoes(LoptsNRep)).

parse_operacoes([],[]).
parse_operacoes([H|Data],[H.get(idOperacao)|Lids]):-
    parse_operacoes(Data,Lids). 

obterTiposEferramentasOperacoes([],[],[]).
obterTiposEferramentasOperacoes([IdOP|Lids],[Fer|Lfer],[Tipo|Lopts]):-
    split_string(IdOP,"-","",Split),
    append([Tipo],[Fer],Split),
    obterTiposEferramentasOperacoes(Lids,Lfer,Lopts).

removerRepetidos([],[]).
removerRepetidos([H|Lista],[H|ListaNRep]):-
                not(member(H,Lista)), !,
                removerRepetidos(Lista,ListaNRep).
removerRepetidos([_|Lista],ListaNRep):-removerRepetidos(Lista,ListaNRep).
%%operacao_maquina(opt1,ma,fa,1,1).
%%-----------------------------------------------------------------------------
atribuirMaquinaOperacoesAll():-
                obterMaquinas(Maquinas),
                obterOperacoes(Operacoes),
                obterTiposMaquina(TiposMaquina),
                atribuirMaquinasOperacoes(Operacoes,Maquinas,TiposMaquina).

atribuirMaquinasOperacoes(_,[],_):-!.
atribuirMaquinasOperacoes(DataOperacao,[H|DataMaquina],DataTipoMaquina):-
                        operacaoMaquina(H,DataOperacao,DataTipoMaquina,ObjectOperacoes),
                        assertTodasOperacoes(H,ObjectOperacoes),
                        atribuirMaquinasOperacoes(DataOperacao,DataMaquina,DataTipoMaquina).
%%Assert all operacoes
assertTodasOperacoes(_,[]).
assertTodasOperacoes(Maquina,[Op|ObjectOperacoes]):-
                    obterTipoEFerramenta(Op,Ferramenta,Tipo),
                    asserta(operacao_maquina(Tipo,Maquina.get(idMaquina),Ferramenta,Op.get(tempoSetup),Op.get(duracao))),
                    assertTodasOperacoes(Maquina,ObjectOperacoes).

%%Get ferramenta e Tipo
obterTipoEFerramenta(OperacaoObject,Ferramenta,Tipo):-
                 split_string(OperacaoObject.get(idOperacao),"-","",Split),
                 append([Tipo],[Ferramenta],Split).

operacaoMaquina(Maquina,DataOperacao,DataTipoMaquina,ObjectOperacoes):-
                    tipoMaquinaMaquina(Maquina,DataTipoMaquina,IdsOperacao),
                    operacoesTipoMaquina(IdsOperacao,DataOperacao,ObjectOperacoes).

tipoMaquinaMaquina(_,[],_).
tipoMaquinaMaquina(Maquina,[H|TipoMaquina],TipoMaquinaOperacoes):-
                    H.get(idTipoDeMaquina)==Maquina.get(idTipoDeMaquina),
                    TipoMaquinaOperacoes = H.get(listaOperacoes),
                    tipoMaquinaMaquina(Maquina,TipoMaquina,TipoMaquinaOperacoes).
tipoMaquinaMaquina(Maquina,[_|TipoMaquina],TipoMaquinaOperacoes):-tipoMaquinaMaquina(Maquina,TipoMaquina,TipoMaquinaOperacoes).

operacoesTipoMaquina([],[],_).
operacoesTipoMaquina([H|ListaIdsOperacoes],[H2|Operacoes],[Op|ObjectOperacoes]):-
                    H==H2.get(idOperacao),
                    Op = H2,
                    operacoesTipoMaquina(ListaIdsOperacoes,Operacoes,ObjectOperacoes).
operacoesTipoMaquina(ListaIdsOperacoes,[_|Operacoes],ObjectOperacoes):-
                        operacoesTipoMaquina(ListaIdsOperacoes,Operacoes,ObjectOperacoes).
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
adicionarMaquinas() :-
    obterMaquinas(Data),
    parse_maquinas(Data,Lids),
    asserta(maquinas(Lids)).

parse_maquinas([],[]).
parse_maquinas([H|Data],[H.get(idMaquina)|Lids]):-
    parse_maquinas(Data,Lids).    

adicionarLinhasProducao() :-
    obterLinhasDeProducao(Data),
    parse_linhas(Data,Lids),
    asserta(linhas(Lids)).

parse_linhas([],[]).
parse_linhas([H|Data],[H.get(idLinhaDeProducao)|Lids]):-
    atribuirMaquinasALinhas(H.get(idLinhaDeProducao),H.get(listaIdsMaquina)),
    parse_linhas(Data,Lids).

atribuirMaquinasALinhas(IdLinha,Maquinas):-
    asserta(tipos_maq_linha(IdLinha,Maquinas)).



% Criacao de servidor HTTP no porto 'Port'					
server(Port) :-						
        http_server(http_dispatch, [port(Port)]).


adicionarBaseConhecimento():-
                adicionarLinhasProducao(),
                adicionarMaquinas(),
                atribuirMaquinaOperacoesAll(),
                adicionarOperacoes(),
                adicionarProduto(),
                adicionarEncomendas(),
                adicionarClientes(),!.

removerBaseConhecimento():-
                retractall(ferramentas(_)),
                retractall(tipo_operacoes(_)),
                retractall(linhas(_)),
                retractall(prioridade_cliente(_,_)),
                retractall(maquinas(_)),
                retractall(produtos(_)),
                retractall(e(_,_,_)),
                retractall(clientes(_)),
                retractall(operacoes_produto(_,_)),
                retractall(tipos_maq_linha(_,_)),
                retractall(operacao_maquina(_,_,_,_,_)),
                retractall(encomenda(_,_)),
                %%Dynamic Stuff
                retractall(melhor_sol_to(_,_)),
                retractall(melhor_sol_to_cr(_,_,_,_)),
                retractall(melhor_sol_to_edd(_,_)),
                retractall(classif_operacoes(_,_)),
                retractall(operacoes_atrib_maq(_,_)),
                retractall(op_prod_client(_,_,_,_,_,_,_,_,_)),
                retractall(id_tmp(_)),
                retractall(tarefas(_)),
                retractall(tarefa(_,_,_,_)),
                retractall(tarefas_linha(_,_)),
                retractall(menor_deslocamento(_)),
                retractall(tarefa_encomenda(_,_,_,_,_)),
                retractall(tarefa_op(_,_)),
                retractall(maior_tempo_execucao(_,_)),
                retractall(menor_tempo_amplitude(_)),
                retractall(melhor_sol_linha(_,_,_)),
                retractall(agenda_maq(_,_)),
                retractall(tarefa_makespan(_)).


%http://localhost:5000/api/pp/obterAgendaMaquinas

obter_agenda_maquinas(_Request) :-	
        cors_enable,
        removerBaseConhecimento(),
        adicionarBaseConhecimento(),
        criar_tarefas,
        linhas_balanceamento,
        criar_agendas_maq(),
        findall(agenda_maq(M, LA), agenda_maq(M, LA),Lag),
        criarJSONArray(Lag,JsonArray),
        Reply=agenda_maq_json_array(JsonArray),
        prolog_to_json(Reply, JSONObject),
        reply_json(JSONObject, [json_object(dict)]).

criarJSONArray([],[]).
criarJSONArray([agenda_maq(Maquina, Lista)|Lag],[Reply|JsonArray]):-
            listaAgendas(Lista,JsonArrayAgendas),
            Reply= agenda_maq_json(Maquina,JsonArrayAgendas),
            criarJSONArray(Lag,JsonArray).

listaAgendas([],[]).
listaAgendas([H|Lista],[JsonAgenda|ListaS]):-
            agendaJson(H,JsonAgenda),
            listaAgendas(Lista,ListaS).

agendaJson((TempoInicial,TempoFinal,TipoProcessamento,Lista),JsonAgenda):-
                listaInternaString(Lista,ListaS),
                atom_string(TipoProcessamento,TipoProcessamentoS),
                JsonAgenda=agenda_json(TempoInicial,TempoFinal,TipoProcessamentoS,ListaS).
listaInternaString([],[]).       
listaInternaString([H|Lista],[HS|ListaS]):-
                atom_string(H,HS),
                listaInternaString(Lista,ListaS).

%%Dynamic stuff
criar_tarefas:-  asserta(id_tmp(1)),
				 findall(t(Cliente,Prod,Qt,TConc), (encomenda(Cliente,LE),member(e(Prod,Qt,TConc),LE)),LT),
				 criar_tarefas_encomendas(LT),
				 id_tmp(Id), (retract(tarefas(_));true),
				 Tarefas is Id - 1, asserta(tarefas(Tarefas)),
				 retract(id_tmp(_)),!.

criar_tarefas_encomendas([]):-!.
criar_tarefas_encomendas([t(Cliente,Prod,Qt,TConc)|T]):- operacoes_produto(Prod, LOpt),
														 makespan(LOpt,Qt,Makespan),
					      		   						 prioridade_cliente(Cliente,Prio),
		      					   					     id_tmp(Id),
														 atomic_concat(t,Id,TId),
					      		   						 assertz(tarefa(TId,Makespan,TConc,Prio)),
								   					     assertz(tarefa_encomenda(TId, Cliente, Prod, Qt, TConc)),
			  					   						 incrementar_id(),!,
													     criar_tarefas_encomendas(T).

incrementar_id():- retract(id_tmp(IdAtual)), IdNovo is IdAtual + 1, asserta(id_tmp(IdNovo)).

%============================================================

criarOperacoes(Tarefa, ListaMaq):- 
								tarefa_encomenda(Tarefa,_,Prod,_,_),
								operacoes_produto(Prod, LOpt),!,
								criarOperacoes1(Tarefa, LOpt, ListaMaq, LOp),!,
								asserta(tarefa_op(Tarefa,LOp)).

criarOperacoes1(_,[],_,[]):-!.
criarOperacoes1(Tarefa, [Opt| ListaOpt], [Maq|ListaMaq], [OpId|LOp]):-
													!,operacao_maquina(Opt,Maq,Fer,Tsetup,Texec),!, 
													id_tmp(Id),
													atomic_concat(op,Id,OpId),
													assertz(classif_operacoes(OpId,Opt)),
													(operacoes_atrib_maq(Maq,_);assertz(operacoes_atrib_maq(Maq,[]))),
													retract(operacoes_atrib_maq(Maq,LOpx)),
													append(LOpx, [OpId], LOpMaq),
													assertz(operacoes_atrib_maq(Maq,LOpMaq)),
													tarefa_encomenda(Tarefa, Cliente, Prod, Qt, TConc),
													assertz(op_prod_client(OpId,Maq,Fer,Prod,Cliente,Qt,TConc,Tsetup,Texec)),
													incrementar_id(),
													criarOperacoes1(Tarefa,ListaOpt,ListaMaq,LOp).
criarOperacoes1(Tarefa, ListaOpt, [_|ListaMaq], LOp):- criarOperacoes1(Tarefa,ListaOpt,ListaMaq, LOp).

%================= Atribuição das tarefas nas linhas =================

linhas_balanceamento:-
						findall(Tarefa,tarefa(Tarefa,_,_,_),ListaTarefas),
						h_m_tempo_atraso_edd_ag(ListaTarefas,ListaTarefasOrd,_),
						inicializarLinhas(ListaLinhasIniciadas),
						asserta(id_tmp(1)),
						balancear_tarefas(ListaTarefasOrd, ListaLinhasIniciadas),!,
						retract(id_tmp(_)).

inicializarLinhas(ListaLinhasIniciadas):- 
						findall((Linha,ListaMaq),tipos_maq_linha(Linha,ListaMaq),ListaTipos_maq_linha),
						inicializarLinhas1(ListaTipos_maq_linha, ListaLinhasIniciadas).

inicializarLinhas1([],[]):-!.
inicializarLinhas1([(Linha,ListaMaq)|T], [(Linha, ListaMaq, 0)|ListaLinhasIniciadas]):-
																						asserta(tarefas_linha(Linha,[])),
																						inicializarLinhas1(T, ListaLinhasIniciadas).

balancear_tarefas([],_):-!.
balancear_tarefas([Tarefa | T], ListaLinhasIniciadas):-
														asserta(melhor_sol_linha(_,_,100000000000000000000)),!,
														obterMelhorLista(Tarefa, ListaLinhasIniciadas),
														retract(melhor_sol_linha(Linha,ListaMaq,MakespanLinha)),!,
														MakespanLinha \== 100000000000000000000,
														delete(ListaLinhasIniciadas, (Linha,_,_), ListaLinhasIniciadasApagada),
														tarefa(Tarefa, Makespan,_,_),
														MakespanLinhaNovo is MakespanLinha + Makespan,
														append(ListaLinhasIniciadasApagada, [(Linha, ListaMaq, MakespanLinhaNovo)], ListaLinhasIniciadasNova),
														atualiza_tarefas_linha(Linha, Tarefa),
														criarOperacoes(Tarefa, ListaMaq),!,
														balancear_tarefas(T, ListaLinhasIniciadasNova).

obterMelhorLista(_, []):-!.
obterMelhorLista(Tarefa, [(Linha, ListaMaq, MakespanLinha)|ListaLinhasIniciadas]):-
																					(pertenceALinha(Tarefa,ListaMaq),atualiza_menor_makespanLinha(Linha,ListaMaq,MakespanLinha);true),!,
																					obterMelhorLista(Tarefa, ListaLinhasIniciadas).

pertenceALinha(Tarefa, ListaMaq):- 
								tarefa_encomenda(Tarefa,_,Prod,_,_),operacoes_produto(Prod, LOpt),!, pertenceALinha1(LOpt, ListaMaq).

pertenceALinha1(_,[]):-false,!.
pertenceALinha1([],_):-!.
pertenceALinha1([Opt| ListaOpt], [Maq|ListaMaq]):-
													(operacao_maquina(Opt,Maq,_,_,_),!, pertenceALinha1(ListaOpt,ListaMaq);pertenceALinha1([Opt| ListaOpt],ListaMaq)).

atualiza_menor_makespanLinha(Linha,ListaMaq,Makespan):-
							  melhor_sol_linha(_,_,MakespanM),
							  Makespan<MakespanM,retract(melhor_sol_linha(_,_,_)),
							  asserta(melhor_sol_linha(Linha,ListaMaq,Makespan)),!.

atualiza_tarefas_linha(Linha,Tarefa):-
							  retract(tarefas_linha(Linha,ListaTarefa)),
							  append(ListaTarefa, [Tarefa], ListaTarefaNova),
							  asserta(tarefas_linha(Linha,ListaTarefaNova)),!.


