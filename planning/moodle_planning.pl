% Declaração do módulo 'planning' e os predicados públicos
% 'schedule_all_surgeries/2' é o predicado principal exportado pelo módulo
:- module(planning, [schedule_all_surgeries/2]).

% Declaração das bases de dados dinâmicas, que armazenam as informações durante a execução
% availability/3: Armazena a disponibilidade dos médicos em um determinado dia
% agenda_staff/3: Armazena a agenda dos médicos com horários específicos e códigos de cirurgia atribuídos
% agenda_staff1/3: Versão intermediária da agenda dos médicos
% agenda_operation_room/3: Armazena a agenda das salas de operações para um determinado dia
% agenda_operation_room1/3: Versão intermediária da agenda das salas de operações

:- dynamic availability/3.
:- dynamic agenda_staff/3.
:- dynamic agenda_staff1/3.
:-dynamic agenda_operation_room/3.
:-dynamic agenda_operation_room1/3.
:-dynamic better_sol/5.

% Definição das agendas dos médicos e a atribuição de salas de operação para um determinado dia
% Cada entrada é composta por (médico, data, lista de horários com tipo de cirurgia e sala)
agenda_staff(d001, 20241028, [(720, 790, m01), (1080, 1140, c01)]).
agenda_staff(d002, 20241028, [(850, 900, m02), (901, 960, m02), (1380, 1440, c02)]).
agenda_staff(d003, 20241028, [(720, 790, m01), (910, 980, m02)]).
%agenda_staff(d004,20241028,[(850,900,m02),(940,980,c04)]).

% Definição dos horários gerais (início e fim) de disponibilidade de cada médico no dia
timetable(d001, 20241028, (480, 1200)).
timetable(d002, 20241028, (500, 1440)).
timetable(d003, 20241028, (520, 1320)).
%timetable(d004,20241028,(620,1020)).

% Definição dos médicos (ID, tipo de funcionário, especialização) e as cirurgias que eles podem realizar
staff(d001, doctor, orthopaedist, [so2, so3, so4]).
staff(d002, doctor, orthopaedist, [so2, so3, so4]).
staff(d003, doctor, orthopaedist, [so2, so3, so4]).


%surgery(SurgeryType,TAnesthesia,TSurgery,TCleaning).
surgery(so2, 45, 60, 45).
surgery(so3, 45, 90, 45).
surgery(so4, 45, 75, 45).

% Atribuição de IDs às cirurgias para fácil referência
surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).
surgery_id(so100004,so2).
surgery_id(so100005,so4).
 surgery_id(so100006,so2).
 surgery_id(so100007,so3).
 surgery_id(so100008,so2).
 surgery_id(so100009,so2).
 surgery_id(so100010,so2).
 surgery_id(so100011,so4).
surgery_id(so100012,so2).
surgery_id(so100013,so2).

% Atribuição de cirurgias a médicos específicos para indicar quais médicos irão realizar qual cirurgia
assignment_surgery(so100001,d001).
assignment_surgery(so100002,d002).
assignment_surgery(so100003,d003).
assignment_surgery(so100004,d001).
 assignment_surgery(so100004,d002).
 assignment_surgery(so100005,d002).
 assignment_surgery(so100005,d003).
 assignment_surgery(so100006,d001).
 assignment_surgery(so100007,d003).
 assignment_surgery(so100008,d004).
 assignment_surgery(so100008,d003).
 assignment_surgery(so100009,d002).
 assignment_surgery(so100009,d004).
 assignment_surgery(so100010,d003).
 assignment_surgery(so100011,d001).
assignment_surgery(so100012,d001).
assignment_surgery(so100013,d004).

% Definição da agenda da sala de operações para um determinado dia
% Cada entrada é composta por (ID da sala, data, lista de horários com cirurgia atribuída)
agenda_operation_room(or1, 20241028, [(520, 579, so100000), (1000, 1059, so099999)]).


%-------------------------------------------------------------------------------------------------------------%

% Predicado principal para agendar todas as cirurgias

schedule_all_surgeries(Room, Day) :-
    % Limpa as agendas e disponibilidades anteriores
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(availability(_,_,_)),

    findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda))),_),
    agenda_operation_room(Or,Date,Agenda),assert(agenda_operation_room1(Or,Date,Agenda)),

    findall(_,(agenda_staff1(D,Date,L),free_agenda0(L,LFA),adapt_timetable(D,Date,LFA,LFA2),assertz(availability(D,Date,LFA2))),_),
    findall(OpCode,surgery_id(OpCode,_),LOpCode),

    % Verifica as disponibilidades para as cirurgias em todas as salas e dias
    availability_all_surgeries(LOpCode, Room, Day), !.


%-------------------------------------------------------------------------------------------------------------%
% Predicados auxiliares para encontrar e adaptar horários


% Caso base para quando não há mais horários na lista de agendas: o horário livre é de 0 a 1440 (todo o dia).
free_agenda0([], [(0, 1440)]).

% Se a agenda tem um horário de início e fim (Tin, Tfin), chamamos o predicado `free_agenda1` para tratar.
free_agenda0([(0, Tfin, _) | LT], LT1) :-
    !, free_agenda1([(0, Tfin, _) | LT], LT1).

% Se o horário de entrada de um médico (Tin) não começa no início do dia, ajustamos a agenda inserindo esse tempo livre.
free_agenda0([(Tin, Tfin, _) | LT], [(0, T1) | LT1]) :-
    T1 is Tin - 1,
    free_agenda1([(Tin, Tfin, _) | LT], LT1).


% Predicado auxiliar que trata a parte da agenda em que há somente um intervalo de tempo.
free_agenda1([(_, Tfin, _)], [(T1, 1440)]) :-
    Tfin \== 1440,
    !, T1 is Tfin + 1.

% Caso base para a agenda estar vazia, ou sem intervalo de tempo válido.
free_agenda1([(_, _, _)], []).

% Se dois intervalos de tempo consecutivos se tocam, o intervalo de tempo livre segue após o primeiro.
free_agenda1([(_, T, _), (T1, Tfin2, _) | LT], LT1) :-
    Tx is T + 1,
    T1 == Tx,
    !, free_agenda1([(T1, Tfin2, _) | LT], LT1).

% Caso em que há dois intervalos de tempo não consecutivos, criando o intervalo livre entre eles.
free_agenda1([(_, Tfin1, _), (Tin2, Tfin2, _) | LT], [(T1, T2) | LT1]) :-
    T1 is Tfin1 + 1,
    T2 is Tin2 - 1,
    free_agenda1([(Tin2, Tfin2, _) | LT], LT1).


% Adaptar a agenda de acordo com os horários disponíveis de um médico.
adapt_timetable(D, Date, LFA, LFA2) :-
    timetable(D, Date, (InTime, FinTime)), % Obtém os horários de cleaum médico
    treatin(InTime, LFA, LFA1),  % Trata a entrada inicial do horário
    treatfin(FinTime, LFA1, LFA2).  % Trata a saída final do horário



% Predicado auxiliar para ajustar o início do horário (InTime) na lista de horários disponíveis.
treatin(InTime, [(In, Fin) | LFA], [(In, Fin) | LFA]) :-
    InTime =< In,
    !.

% Caso em que o horário de entrada (InTime) é maior que o tempo de fim (Fin) do intervalo, continua a busca.
treatin(InTime, [(_, Fin) | LFA], LFA1) :-
    InTime > Fin,
    !,
    treatin(InTime, LFA, LFA1).

% Caso em que a hora de entrada se encaixa dentro de um intervalo, é ajustado na agenda.
treatin(InTime, [(_, Fin) | LFA], [(InTime, Fin) | LFA]).

% Caso base para quando a lista de horários disponíveis está vazia.
treatin(_, [], []).


% Predicado auxiliar para ajustar o fim do horário (FinTime) na lista de horários disponíveis.
treatfin(FinTime, [(In, Fin) | LFA], [(In, Fin) | LFA1]) :-
    FinTime >= Fin,
    !,
    treatfin(FinTime, LFA, LFA1).

% Caso em que o horário de fim (FinTime) é menor que o início de um intervalo, a lista de horários é terminada.
treatfin(FinTime, [(In, _) | _], []) :-
    FinTime =< In,
    !.

% Quando o horário de fim está dentro de um intervalo, ajusta o horário de fim.
treatfin(FinTime, [(In, _) | _], [(In, FinTime)]).

% Caso base para quando a lista de horários disponíveis está vazia.
treatfin(_, [], []).



% Predicado para intersectar as agendas de múltiplos médicos em uma data específica.
intersect_all_agendas([Name], Date, LA) :-
    !,
    availability(Name, Date, LA).  % Caso base: se há apenas um nome, obtemos sua disponibilidade diretamente.

% Predicado para intersectar as agendas de múltiplos médicos.
intersect_all_agendas([Name | LNames], Date, LI) :-
    availability(Name, Date, LA),  % Obtém a disponibilidade do primeiro médico.
    intersect_all_agendas(LNames, Date, LI1),  % Chama recursivamente para os demais médicos.
    intersect_2_agendas(LA, LI1, LI).  % Intersecta a disponibilidade do primeiro médico com o restante.


% Predicado para intersectar duas agendas.
intersect_2_agendas([], _, []).  % Caso base: se a primeira lista estiver vazia, o resultado também é vazio.

% Predicado que intersecta duas agendas. Para cada elemento da primeira lista (D), verifica-se
% a interseção com a segunda lista (LA).
intersect_2_agendas([D | LD], LA, LIT) :-
    intersect_availability(D, LA, LI, LA1),  % Intersecta o item D da primeira lista com a segunda.
    intersect_2_agendas(LD, LA1, LID),  % Recursivamente processa o restante da primeira lista.
    append(LI, LID, LIT).  % Combina os resultados das interseções em uma lista final.


% Predicado que trata a interseção de uma disponibilidade com uma lista de intervalos.
intersect_availability((_, _), [], [], []).  % Caso base: se não há mais intervalos na segunda lista, não há interseção.

% Se o intervalo de término do primeiro médico (Fim) é menor que o início do intervalo da lista,
% adiciona o intervalo original à lista e não há interseção.
intersect_availability((_, Fim), [(Ini1, Fim1) | LD], [], [(Ini1, Fim1) | LD]) :-
    Fim < Ini1, !.

% Se o intervalo de início do primeiro médico (Ini) é maior que o fim do intervalo da lista,
% prossegue para a próxima interseção.
intersect_availability((Ini, Fim), [(_, Fim1) | LD], LI, LA) :-
    Ini > Fim1, !,
    intersect_availability((Ini, Fim), LD, LI, LA).

% Caso em que há sobreposição de horários. O horário de interseção é ajustado para o mínimo e máximo
% entre os dois intervalos (Ini, Fim) e (Ini1, Fim1).
intersect_availability((Ini, Fim), [(Ini1, Fim1) | LD], [(Imax, Fmin)], [(Fim, Fim1) | LD]) :-
    Fim1 > Fim, !,  % Verifica se há sobreposição.
    min_max(Ini, Ini1, _, Imax),  % Obtém o valor mínimo de início.
    min_max(Fim, Fim1, Fmin, _).  % Obtém o valor máximo de fim.

% Caso em que o fim do primeiro intervalo é maior que o fim do segundo, ajusta a interseção.
intersect_availability((Ini, Fim), [(Ini1, Fim1) | LD], [(Imax, Fmin) | LI], LA) :-
    Fim >= Fim1, !,  % Verifica a sobreposição.
    min_max(Ini, Ini1, _, Imax),  % Obtém o valor mínimo de início.
    min_max(Fim, Fim1, Fmin, _),  % Obtém o valor máximo de fim.
    intersect_availability((Fim1, Fim), LD, LI, LA).  % Recursivamente processa a lista restante.


% Predicado para calcular o mínimo e máximo entre dois valores.
min_max(I, I1, I, I1) :- I < I1, !.  % Caso base: se o primeiro valor for menor, ele se torna o mínimo.
min_max(I, I1, I1, I).  % Caso contrário, o segundo valor é o mínimo e o primeiro é o máximo.


% Predicado que verifica a disponibilidade de todas as cirurgias
availability_all_surgeries([], _, _).  % Caso base: sem cirurgias, nada a fazer.
availability_all_surgeries([OpCode | LOpCode], Room, Day) :-
    % Para cada cirurgia, obtém o tipo e os horários associados
    surgery_id(OpCode,OpType),surgery(OpType,_,TSurgery,_),


    % Verifica a disponibilidade dos médicos e da sala para a cirurgia
    availability_operation(OpCode, Room, Day, LPossibilities, LDoctors),

    % Calcula o primeiro intervalo disponível para a cirurgia
    schedule_first_interval(TSurgery, LPossibilities, (TinS, TfinS)),

    % Atualiza a agenda da sala de operação com o novo intervalo
    retract(agenda_operation_room1(Room, Day, Agenda)),
    insert_agenda((TinS, TfinS, OpCode), Agenda, Agenda1),
    assertz(agenda_operation_room1(Room, Day, Agenda1)),

    % Insere o intervalo de médicos na agenda de cada um
    insert_agenda_doctors((TinS, TfinS, OpCode), Day, LDoctors),

    % Recursivamente verifica as outras cirurgias
    availability_all_surgeries(LOpCode, Room, Day).


% Verifica a disponibilidade para uma operação específica, considerando os médicos e a sala
availability_operation(OpCode, Room, Day, LPossibilities, LDoctors) :-
    surgery_id(OpCode, OpType), surgery(OpType, _, TSurgery, _),
    % Busca todos os médicos atribuídos à cirurgia
    findall(Doctor, assignment_surgery(OpCode, Doctor), LDoctors),

    % Intersecta todas as agendas dos médicos
    intersect_all_agendas(LDoctors, Day, LA),

    % Obtém a agenda atual da sala de operação
    agenda_operation_room1(Room, Day, LAgenda),
    free_agenda0(LAgenda, LFAgRoom),

    % Intersecta a agenda da sala com a dos médicos para verificar os horários possíveis
    intersect_2_agendas(LA, LFAgRoom, LIntAgDoctorsRoom),

    % Remove os intervalos que não são viáveis para a cirurgia
    remove_unf_intervals(TSurgery, LIntAgDoctorsRoom, LPossibilities).

    % Remove intervalos que não são compatíveis com a duração da cirurgia
    remove_unf_intervals(_, [], []).  % Caso base: sem intervalos, retorna vazio.
    remove_unf_intervals(TSurgery, [(Tin, Tfin) | LA], [(Tin, Tfin) | LA1]) :-
        DT is Tfin - Tin + 1, TSurgery =< DT, !,  % Verifica se o intervalo é longo o suficiente para a cirurgia.
        remove_unf_intervals(TSurgery, LA, LA1).
    remove_unf_intervals(TSurgery, [_ | LA], LA1) :-
        remove_unf_intervals(TSurgery, LA, LA1).


    % Calcula o primeiro intervalo possível para a cirurgia, baseado na sua duração
    schedule_first_interval(TSurgery, [(Tin, _) | _], (Tin, TfinS)) :-
        TfinS is Tin + TSurgery - 1.  % O fim é o início mais a duração da cirurgia.


    % Insere um novo intervalo de operação na agenda, mantendo a ordem
    insert_agenda((TinS, TfinS, OpCode), [], [(TinS, TfinS, OpCode)]).  % Caso base: agenda vazia.
    insert_agenda((TinS, TfinS, OpCode), [(Tin, Tfin, OpCode1) | LA], [(TinS, TfinS, OpCode), (Tin, Tfin, OpCode1) | LA]) :-
        TfinS < Tin, !.  % Se o novo intervalo é antes do intervalo existente, insere na frente.
    insert_agenda((TinS, TfinS, OpCode), [(Tin, Tfin, OpCode1) | LA], [(Tin, Tfin, OpCode1) | LA1]) :-
        insert_agenda((TinS, TfinS, OpCode), LA, LA1).  % Caso contrário, insere recursivamente.


    % Insere os intervalos de médicos na agenda de cada um
    insert_agenda_doctors(_, _, []).  % Caso base: sem médicos, nada a fazer.
    insert_agenda_doctors((TinS, TfinS, OpCode), Day, [Doctor | LDoctors]) :-
        % Atualiza a agenda do médico com o novo intervalo
        retract(agenda_staff1(Doctor, Day, Agenda)),
        insert_agenda((TinS, TfinS, OpCode), Agenda, Agenda1),
        assert(agenda_staff1(Doctor, Day, Agenda1)),

        % Recursivamente insere o intervalo para os outros médicos
        insert_agenda_doctors((TinS, TfinS, OpCode), Day, LDoctors).

%-------------------------------------------------------------------------------------------------------------%
%Melhor solucao proposta

% Predicado principal: tenta obter a melhor solução de agendamento para as operações.
obtain_better_sol(Room,Day,AgOpRoomBetter,LAgDoctorsBetter,TFinOp):-
    get_time(Ti),  % Obtém o tempo inicial para medir o tempo de execução.
    (obtain_better_sol1(Room,Day); true),  % Chama a função auxiliar que tenta encontrar uma solução; 'true' garante sucesso mesmo se fail.
    retract(better_sol(Day,Room,AgOpRoomBetter,LAgDoctorsBetter,TFinOp)),  % Retira a melhor solução encontrada.
    write('Final Result: AgOpRoomBetter='), write(AgOpRoomBetter), nl,  % Imprime o resultado da agenda das operações.
    write('LAgDoctorsBetter='), write(LAgDoctorsBetter), nl,  % Imprime a lista de agendas dos médicos.
    write('TFinOp='), write(TFinOp), nl,  % Imprime o tempo final da última operação.
    get_time(Tf),  % Obtém o tempo final.
    T is Tf - Ti,  % Calcula o tempo de execução total.
    write('Tempo de geracao da solucao:'), write(T), nl.  % Imprime o tempo de geração da solução.

% Função auxiliar que tenta encontrar uma solução para o dia e a sala especificados.
obtain_better_sol1(Room,Day):-
    asserta(better_sol(Day,Room,_,_,1441)),  % Inicializa a melhor solução com um tempo alto (1441) para permitir melhorias.
    findall(OpCode, surgery_id(OpCode,_), LOC), !,  % Obtém todos os códigos de operações.
    permutation(LOC, LOpCode),  % Gera permutações dos códigos de operação para explorar todas as combinações.
    retractall(agenda_staff1(_,_,_)),  % Remove qualquer agenda anterior armazenada.
    retractall(agenda_operation_room1(_,_,_)),  % Remove agendas de salas anteriores.
    retractall(availability(_,_,_)),  % Remove dados de disponibilidade anteriores.

    % Insere a agenda de cada membro do staff e agenda da sala para o dia especificado.
    findall(_, (agenda_staff(D, Day, Agenda), assertz(agenda_staff1(D, Day, Agenda))), _),
    agenda_operation_room(Room, Day, Agenda), assert(agenda_operation_room1(Room, Day, Agenda)),

    % Prepara as agendas disponíveis para o staff para o dia e adapta o horário.
    findall(_, (agenda_staff1(D, Day, L), free_agenda0(L, LFA), adapt_timetable(D, Day, LFA, LFA2), assertz(availability(D, Day, LFA2))), _),

    availability_all_surgeries(LOpCode, Room, Day),  % Checa disponibilidade para todas as operações na sala e dia.

    agenda_operation_room1(Room, Day, AgendaR),  % Recupera a agenda da sala atualizada.
    update_better_sol(Day, Room, AgendaR, LOpCode),  % Tenta atualizar a melhor solução se uma combinação melhor for encontrada.
    fail.  % Força o backtracking para explorar todas as combinações.

% Atualiza a melhor solução se uma nova combinação de operações resultar em um tempo final menor.
update_better_sol(Day, Room, Agenda, LOpCode):-
    better_sol(Day, Room, _, _, FinTime),  % Obtém o tempo final da solução atual.
    reverse(Agenda, AgendaR),  % Inverte a agenda para avaliação do tempo final.
    evaluate_final_time(AgendaR, LOpCode, FinTime1),  % Avalia o tempo final da nova agenda.

    % Exibe as informações da solução atual sendo analisada.
    write('Analysing for LOpCode='), write(LOpCode), nl,
    write('now: FinTime1='), write(FinTime1), write(' Agenda='), write(Agenda), nl,

    FinTime1 < FinTime,  % Atualiza a melhor solução se o tempo final da nova agenda for menor que a solução atual.
    write('best solution updated'), nl,

    retract(better_sol(_, _, _, _, _)),  % Remove a solução atual.
    findall(Doctor, assignment_surgery(_, Doctor), LDoctors1),  % Coleta a lista de médicos envolvidos nas operações.
    remove_equals(LDoctors1, LDoctors),  % Remove duplicatas dos médicos.
    list_doctors_agenda(Day, LDoctors, LDAgendas),  % Gera a lista de agendas dos médicos.
    asserta(better_sol(Day, Room, Agenda, LDAgendas, FinTime1)).  % Armazena a nova melhor solução.

% Avalia o tempo final da agenda, parando quando encontra o último código de operação da lista.
evaluate_final_time([], _, 1441).  % Retorna 1441 se a lista de operações está vazia.
evaluate_final_time([(_, Tfin, OpCode)|_], LOpCode, Tfin):- member(OpCode, LOpCode), !.  % Retorna o tempo final da última operação.
evaluate_final_time([_|AgR], LOpCode, Tfin):- evaluate_final_time(AgR, LOpCode, Tfin).  % Continua a busca se o código de operação ainda não foi encontrado.

% Gera a lista de agendas dos médicos para o dia especificado.
list_doctors_agenda(_, [], []).
list_doctors_agenda(Day, [D|LD], [(D, AgD)|LAgD]):-
    agenda_staff1(D, Day, AgD),
    list_doctors_agenda(Day, LD, LAgD).

% Remove itens duplicados de uma lista.
remove_equals([], []).
remove_equals([X|L], L1):- member(X, L), !, remove_equals(L, L1).
remove_equals([X|L], [X|L1]):- remove_equals(L, L1).

find_free_agendas(Date):-retractall(availability(_,_,_)),findall(_,(agenda_staff(D,Date,L),free_agenda0(L,LFA),adapt_timetable(D,Date,LFA,LFA2),assertz(availability(D,Date,LFA2))),_).

heuristic_2_for_doctors_only(Room, Day, Solution, FinalTime, ExecutionTime):-
    % tempo inicial de execução
    get_time(Ti),

    % apagar dados antigos
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(availability(_,_,_)),
    retractall(assignment_surgery1(_,_)),

    % inicializar dados
    findall(_,(assignment_surgery(Surgery,Staff),
              assertz(assignment_surgery1(Surgery,Staff))),_),
    findall(_,(agenda_staff(D,Day,Agenda),
              assertz(agenda_staff1(D,Day,Agenda))),_),
    agenda_operation_room(Room,Day,Agenda),
    assert(agenda_operation_room1(Room,Day,Agenda)),
    
    % obter tempo livre para os medicos
    find_free_agendas(Day),
    
    % obter todas as cirurgias que não estão agendadas
    findall(OpCode, surgery_id(OpCode,_), AllSurgeries),
    schedule_surgeries(Room, Day, AllSurgeries),
    
    % obter a agenda final de acordo com a ocupação dos medicos
    agenda_operation_room1(Room, Day, Solution),
    
    % obter o tempo final da ultima cirurgia
    findLast(Solution, FinalTime),
    
    % calcular o tempo de execução
    get_time(Tf),
    ExecutionTime is Tf - Ti.

% predicado para obter o tempo final da ultima cirurgia
findLast([], 0).
findLast([(_, End, _)], End).
findLast([_|Rest], FinalTime) :- findLast(Rest, FinalTime).

% agendar cirurgias
schedule_surgeries(_, _, []).
schedule_surgeries(Room, Day, Surgeries) :-
    % calcular a ocupação para cada medico
    calculate_doctors_occupation(Day, Surgeries, OccupationRates),
    
    % encontrar medico com maior taxa de ocupação
    find_highest_occupation(OccupationRates, Doctor, _),
    
    % obter primeira cirurgia disponível para o medico
    find_doctor_surgery(Doctor, Surgeries, NextSurgery),
    
    % agendar cirurgia para o medico
    (
        availability_all_surgeries([NextSurgery], Room, Day),
        % tirar cirurgia da lista
        delete(Surgeries, NextSurgery, RemainingSurgeries),
        % Continua com as cirurgias restantes
        schedule_surgeries(Room, Day, RemainingSurgeries)
    ;
        % no caso de falha, tenta a proxima cirurgia
        delete(Surgeries, NextSurgery, RemainingSurgeries),
        schedule_surgeries(Room, Day, RemainingSurgeries)
    ).

% predicado auxiliar para calcular a taxa de ocupação de cada medico
calculate_doctors_occupation(Day, Surgeries, OccupationRates) :-
    findall(Doctor, staff(Doctor, doctor, _, _), Doctors),
    findall((Doctor, Rate),
            (member(Doctor, Doctors),
             calculate_doctor_rate(Doctor, Day, Surgeries, Rate)),
            OccupationRates).

% predicado auxiliar para calcular a taxa de ocupação de um medico
calculate_doctor_rate(Doctor, Day, Surgeries, Rate) :-
    % Calcula tempo total disponível
    availability(Doctor, Day, FreeSlots),
    sum_available_time(FreeSlots, AvailableTime),
    
    % calcula o tempo total de cirurgias pendentes
    findall(Duration,
            (member(Surgery, Surgeries),
             assignment_surgery(Surgery, Doctor),
             surgery_id(Surgery, Type),
             surgery(Type, TAnesthesia, TSurgery, TCleaning),
             Duration is TAnesthesia + TSurgery + TCleaning),
            Durations),
    sum_list(Durations, TotalSurgeryTime),
    
    (
        AvailableTime > 0,
        Rate is (TotalSurgeryTime / AvailableTime) * 100
    ;
        Rate = 0
    ).

% soma do tempo disponível
sum_available_time([], 0).
sum_available_time([(Start, End)|Rest], Total) :-
    sum_available_time(Rest, RestTotal),
    Total is RestTotal + (End - Start + 1).

% encontra maior taxa de ocupação
find_highest_occupation([], none, 0).
find_highest_occupation([(Doctor, Rate)|Rest], HighestDoctor, HighestRate) :-
    find_highest_occupation(Rest, RestDoctor, RestRate),
    (
        Rate > RestRate,
        HighestDoctor = Doctor,
        HighestRate = Rate
    ;
        HighestDoctor = RestDoctor,
        HighestRate = RestRate
    ).

% encontra a primeira cirurgia disponível para um medico
find_doctor_surgery(Doctor, Surgeries, Surgery) :-
    member(Surgery, Surgeries),
    assignment_surgery(Surgery, Doctor).
