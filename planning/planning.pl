:- module(planning, [obtain_better_sol/5]).

:- dynamic availability/3.
:- dynamic agenda_staff/3.
:- dynamic agenda_staff1/3.
:- dynamic agenda_operation_room/3.
:- dynamic agenda_operation_room1/3.
:- dynamic better_sol/5.


% (médico, data, lista de horários com tipo de cirurgia e sala)
agenda_staff(d001, 20241028, [(540, 600, m01)]).
agenda_staff(d002, 20241028, [(540, 600, m02)]).
agenda_staff(d003, 20241028, [(540, 600, m01)]).
agenda_staff(d004, 20241028, [(540, 600, m01)]).

agenda_staff(n001, 20241028, [(540, 600, m01)]).
agenda_staff(n002, 20241028, [(540, 600, m01)]).
agenda_staff(n003, 20241028, [(540, 600, m01)]).
agenda_staff(a001, 20241028, [(540, 600, m01)]).


% Definição dos horários gerais (início e fim) de disponibilidade de cada médico no dia
timetable(d001, 20241028, (480, 1440)).
timetable(d002, 20241028, (480, 1440)).
timetable(d003, 20241028, (480, 1440)).
timetable(d004, 20241028, (480, 1440)).

timetable(n001, 20241028, (480, 1440)).
timetable(n002, 20241028, (480, 1440)).
timetable(n003, 20241028, (480, 1440)).
timetable(a001, 20241028, (480, 1440)).

% (ID, tipo de funcionário, especialização) e as cirurgias que eles podem realizar
staff(d001, doctor, orthopaedist, [so2, so3, so4]).
staff(d002, doctor, orthopaedist, [so2, so3, so4]).
staff(d003, doctor, orthopaedist, [so2, so3]).
staff(d004, doctor, anaesthetist, [so2, so3, so4]).
staff(n001, nurse, instrumenting, [so2, so3, so4]).
staff(n002, nurse, circulating, [so2, so3, so4]).
staff(n003, nurse, anaesthetist, [so2, so3, so4]).
staff(a001, assistant , assistant_anaesthetist, [so2, so3, so4]).


%surgery(SurgeryType,TAnesthesia,TSurgery,TCleaning).
surgery(so2, 45, 60, 45). % 150
surgery(so3, 45, 90, 45). % 180
surgery(so4, 45, 75, 45). % 165

surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).


assignment_surgery(so100001,d001).
assignment_surgery(so100002,d001).
assignment_surgery(so100003,d001).

assignment_surgery(so100001,d002).
assignment_surgery(so100002,d002).
assignment_surgery(so100003,d002).

assignment_surgery(so100001,d003).
assignment_surgery(so100002,d003).

assignment_surgery(so100001,d004).
assignment_surgery(so100002,d004).
assignment_surgery(so100003,d004).

assignment_surgery(so100001,n001).
assignment_surgery(so100002,n001).
assignment_surgery(so100003,n001).

assignment_surgery(so100001,n002).
assignment_surgery(so100002,n002).
assignment_surgery(so100003,n002).

assignment_surgery(so100001,n003).
assignment_surgery(so100002,n003).
assignment_surgery(so100003,n003).

assignment_surgery(so100001,a001).
assignment_surgery(so100002,a001).
assignment_surgery(so100003,a001).

% (ID da sala, data, lista de horários com cirurgia atribuída)
agenda_operation_room(or1, 20241028, [(1000, 1059, so099998), (1100, 1200, so099999)]).
agenda_operation_room(or2, 20241028, []).


%-------------------------------------------------------------------------------------------------------------%
find_free_agendas(Date):-retractall(availability(_,_,_)),findall(_,(agenda_staff(D,Date,L),free_agenda0(L,LFA),adapt_timetable(D,Date,LFA,LFA2),assertz(availability(D,Date,LFA2))),_).

free_agenda0([], [(0, 1440)]).

free_agenda0([(0, Tfin, _) | LT], [(Tfin1, T2) | LT1]) :-
    Tfin1 is Tfin + 1,
    free_agenda1(LT, [(Tfin1, T2) | LT1]).

free_agenda0([(Tin, Tfin, _) | LT], [(0, T1) | LT1]) :-
    T1 is Tin - 1,
    free_agenda1([(Tin, Tfin, _) | LT], LT1).

free_agenda1([(_, Tfin, _)], [(T1, 1440)]) :-
    Tfin \== 1440,
    !, T1 is Tfin + 1.

free_agenda1([(_, _, _)], []).

free_agenda1([(_, T, _), (T1, Tfin2, _) | LT], LT1) :-
    Tx is T + 1,
    T1 == Tx,
    !, free_agenda1([(T1, Tfin2, _) | LT], LT1).

free_agenda1([(_, Tfin1, _), (Tin2, Tfin2, _) | LT], [(T1, T2) | LT1]) :-
    T1 is Tfin1 + 1,
    T2 is Tin2 - 1,
    free_agenda1([(Tin2, Tfin2, _) | LT], LT1).

adapt_timetable(D, Date, LFA, LFA2) :-
    timetable(D, Date, (InTime, FinTime)),
    treatin(InTime, LFA, LFA1),
    treatfin(FinTime, LFA1, LFA2).


treatin(InTime, [(In, Fin) | LFA], [(In, Fin) | LFA]) :-
    InTime =< In,
    !.

treatin(InTime, [(_, Fin) | LFA], LFA1) :-
    InTime > Fin,
    !,
    treatin(InTime, LFA, LFA1).

treatin(InTime, [(_, Fin) | LFA], [(InTime, Fin) | LFA]).

treatin(_, [], []).


treatfin(FinTime, [(In, Fin) | LFA], [(In, Fin) | LFA1]) :-
    FinTime >= Fin,
    !,
    treatfin(FinTime, LFA, LFA1).

treatfin(FinTime, [(In, _) | _], []) :-
    FinTime =< In,
    !.

treatfin(FinTime, [(In, _) | _], [(In, FinTime)]).

treatfin(_, [], []).

intersect_all_agendas([Name], Date, LA) :-
    !,
    availability(Name, Date, LA).

intersect_all_agendas([Name | LNames], Date, LI) :-
    availability(Name, Date, LA),
    intersect_all_agendas(LNames, Date, LI1),
    intersect_2_agendas(LA, LI1, LI).

intersect_2_agendas([], _, []).

intersect_2_agendas([D | LD], LA, LIT) :-
    intersect_availability(D, LA, LI, LA1),
    intersect_2_agendas(LD, LA1, LID),
    append(LI, LID, LIT).

intersect_availability((_, _), [], [], []).

intersect_availability((_, Fim), [(Ini1, Fim1) | LD], [], [(Ini1, Fim1) | LD]) :-
    Fim < Ini1, !.

intersect_availability((Ini, Fim), [(_, Fim1) | LD], LI, LA) :-
    Ini > Fim1, !,
    intersect_availability((Ini, Fim), LD, LI, LA).

intersect_availability((Ini, Fim), [(Ini1, Fim1) | LD], [(Imax, Fmin)], [(Fim, Fim1) | LD]) :-
    Fim1 > Fim, !,
    min_max(Ini, Ini1, _, Imax),
    min_max(Fim, Fim1, Fmin, _).

intersect_availability((Ini, Fim), [(Ini1, Fim1) | LD], [(Imax, Fmin) | LI], LA) :-
    Fim >= Fim1, !,
    min_max(Ini, Ini1, _, Imax),
    min_max(Fim, Fim1, Fmin, _),
    intersect_availability((Fim1, Fim), LD, LI, LA).

min_max(I, I1, I, I1) :- I < I1, !.
min_max(I, I1, I1, I).

availability_all_surgeries([], _, _).

availability_all_surgeries([OpCode | LOpCode], Room, Day) :-
    surgery_id(OpCode,OpType),surgery(OpType,TAnesthesia,TSurgery,TCleaning),
    TempoTotal is TAnesthesia + TSurgery + TCleaning,
    availability_operation(OpCode, Room, Day, LPossibilities, LStaffs),

    schedule_first_interval(TempoTotal, LPossibilities, (TinS, TfinS)),

    retract(agenda_operation_room1(Room, Day, Agenda)),
    insert_agenda((TinS, TfinS, OpCode), Agenda, Agenda1),
    assertz(agenda_operation_room1(Room, Day, Agenda1)),

    insert_agenda_staff((TinS, TfinS, OpCode), Day, LStaffs),

    availability_all_surgeries(LOpCode, Room, Day).

availability_operation(OpCode, Room, Day, LPossibilities, LStaffs) :-

    surgery_id(OpCode, OpType), surgery(OpType, TAnesthesia, TSurgery, TCleaning),

    TempoTotal is TAnesthesia + TSurgery + TCleaning,

    findall(Staff, assignment_surgery(OpCode, Staff), LStaffs),

    intersect_all_agendas(LStaffs, Day, LA),

    agenda_operation_room1(Room, Day, LAgenda),

    free_agenda0(LAgenda, LFAgRoom),

    intersect_2_agendas(LA, LFAgRoom, LIntAgStaffsRoom),


remove_unf_intervals(TempoTotal, LIntAgStaffsRoom, LPossibilities).

remove_unf_intervals(_, [], []).

remove_unf_intervals(TempoTotal, [(Tin, Tfin) | LA], [(Tin, Tfin) | LA1]) :-
    DT is Tfin - Tin + 1,
    TempoTotal =< DT,
    !,
    remove_unf_intervals(TempoTotal, LA, LA1).

remove_unf_intervals(TempoTotal, [_ | LA], LA1) :-
    remove_unf_intervals(TempoTotal, LA, LA1).


schedule_first_interval(TempoTotal, [(Tin, _) | _], (Tin, TfinS)) :-
    TfinS is Tin + TempoTotal - 1.


insert_agenda((TinS, TfinS, OpCode), [], [(TinS, TfinS, OpCode)]).

insert_agenda((TinS, TfinS, OpCode), [(Tin, Tfin, OpCode1) | LA], [(TinS, TfinS, OpCode), (Tin, Tfin, OpCode1) | LA]) :-
    TfinS < Tin, !.

insert_agenda((TinS, TfinS, OpCode), [(Tin, Tfin, OpCode1) | LA], [(Tin, Tfin, OpCode1) | LA1]) :-
    insert_agenda((TinS, TfinS, OpCode), LA, LA1).





insert_agenda_staff(_, _, []).

insert_agenda_staff((TinS, TfinS, OpCode), Day, [Staff | LStaffs]) :-
    staff(Staff, _, Role, _),
    surgery_id(OpCode, OpType),
    surgery(OpType, TAnesthesia, TSurgery, TCleaning),
    compute_phase_times((TinS, TfinS),TAnesthesia, TSurgery, TCleaning  ,  Role, (TStart, TEnd)),
    retract(agenda_staff1(Staff, Day, Agenda)),
    insert_agenda((TStart, TEnd, OpCode), Agenda, Agenda1),
    assertz(agenda_staff1(Staff, Day, Agenda1)),

    insert_agenda_staff((TinS, TfinS, OpCode), Day, LStaffs).



compute_phase_times((TinS, _), TAnesthesia,TSurgery, _, anaesthetist, (TinS, TEnd)) :-
    TEnd is TinS + TAnesthesia + TSurgery -1.

compute_phase_times((TinS, TEnd), TAnesthesia,_, TCleaning, orthopaedist , (TinS2, TEnd2)) :-
    TinS2 is TinS + TAnesthesia-1,
    TEnd2 is TEnd - TCleaning -1.

compute_phase_times((TinS, TEnd), TAnesthesia,_, TCleaning, instrumenting , (TinS2, TEnd2)) :-
    TinS2 is TinS + TAnesthesia-1,
    TEnd2 is TEnd - TCleaning -1.

compute_phase_times((TinS, TEnd), TAnesthesia,_, TCleaning, circulating , (TinS2, TEnd2)) :-
    TinS2 is TinS + TAnesthesia-1,
    TEnd2 is TEnd - TCleaning -1.


compute_phase_times((TinS, TEnd), TAnesthesia,TSurgery, _, assistant_anaesthetist, (TinS2, TEnd)) :-
    TinS2 is  TinS + TAnesthesia+TSurgery-1.

% Predicado principal: tenta obter a melhor solução de agendamento para as operações.
obtain_better_sol(Room,Day,AgOpRoomBetter,LAgStaffBetter,TFinOp):-
    get_time(Ti),
    (obtain_better_sol1(Room,Day); true),
    retract(better_sol(Day,Room,AgOpRoomBetter,LAgStaffBetter,TFinOp)),
    write('Final Result - ' ), nl ,
    %write('Final Result: AgOpRoomBetter='), write(AgOpRoomBetter), nl,
    %write('LAgStaffBetter='), write(LAgStaffBetter), nl,
    %write('TFinOp='), write(TFinOp), nl,
    get_time(Tf),
    T is Tf - Ti,
    write('Tempo de geracao da solucao:'), write(T), nl.

obtain_better_sol1(Room,Day):-
    asserta(better_sol(Day,Room,_,_,1441)),
    findall(OpCode, surgery_id(OpCode,_), LOC), !,
    permutation(LOC, LOpCode),
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(availability(_,_,_)),

    findall(_, (agenda_staff(D, Day, Agenda), assertz(agenda_staff1(D, Day, Agenda))), _),
    agenda_operation_room(Room, Day, Agenda), assert(agenda_operation_room1(Room, Day, Agenda)),

    findall(_, (agenda_staff1(D, Day, L), free_agenda0(L, LFA), adapt_timetable(D, Day, LFA, LFA2), assertz(availability(D, Day, LFA2))), _),

    availability_all_surgeries(LOpCode, Room, Day),

    agenda_operation_room1(Room, Day, AgendaR),
    update_better_sol(Day, Room, AgendaR, LOpCode),
    fail.

update_better_sol(Day, Room, Agenda, LOpCode):-
    better_sol(Day, Room, _, _, FinTime),
    reverse(Agenda, AgendaR),
    evaluate_final_time(AgendaR, LOpCode, FinTime1),

    %write('Analysing for LOpCode='), write(LOpCode), nl,
    %write('now: FinTime1='), write(FinTime1), write(' Agenda='), write(Agenda), nl,

    FinTime1 < FinTime,
    %write('best solution updated'), nl,

    retract(better_sol(_, _, _, _, _)),
    findall(Staff, assignment_surgery(_, Staff), LStaffs1),
    remove_equals(LStaffs1, LStaffs),
    list_staffs_agenda(Day, LStaffs, LDAgendas),
    asserta(better_sol(Day, Room, Agenda, LDAgendas, FinTime1)).


evaluate_final_time([], _, 1441).
evaluate_final_time([(_, Tfin, OpCode)|_], LOpCode, Tfin):- member(OpCode, LOpCode), !.
evaluate_final_time([_|AgR], LOpCode, Tfin):- evaluate_final_time(AgR, LOpCode, Tfin).

list_staffs_agenda(_, [], []).
list_staffs_agenda(Day, [D|LD], [(D, AgD)|LAgD]):-
    agenda_staff1(D, Day, AgD),
    list_staffs_agenda(Day, LD, LAgD).

remove_equals([], []).
remove_equals([X|L], L1):- member(X, L), !, remove_equals(L, L1).
remove_equals([X|L], [X|L1]):- remove_equals(L, L1).

