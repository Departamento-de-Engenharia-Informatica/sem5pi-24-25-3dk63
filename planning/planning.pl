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
% tempo livre dos staff
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

%------------------------------------------------- First Heuristic -----------------------------------------------------------------------------%

assign_surgeries(Date) :-
    % Get all surgeries and required staff in one go
    findall(Surgery, surgery_id(Surgery, _), SurgeryList),
    find_free_agendas(Date),

    % Process each surgery
    forall(
        member(Surgery, SurgeryList),
        process_surgery(Surgery, Date)
    ),

    % Fetch all agenda assignments once
    findall(
        (Doctor, Agenda),
        agenda_staff(Doctor, Date, Agenda),
        Assignments
    ),
    format("Assignments: ~w~n", [Assignments]).

% Process each surgery
process_surgery(Surgery, Date) :-
    % Get the required staff for this surgery
    findall(Staff, assignment_surgery(Surgery, Staff), RequiredStaff),
    assign_surgery(Date, Surgery, RequiredStaff).

% Assign surgery to the operation room along with the required staff
assign_surgery(Date, Surgery, RequiredStaff) :-
    surgery_id(Surgery, SurgeryType),
    surgery(SurgeryType, TAnesthesia, TSurgery, TCleaning),
    TotalTime is TAnesthesia + TSurgery + TCleaning,

    % Find the earliest available time slot for staff
    find_earliest_available_team(Date, RequiredStaff, TotalTime, StartTime, EndTime),

    % Assign surgery to the required staff
    forall(
        member(Staff, RequiredStaff),
        assign_to_staff(Staff, Date, Surgery, StartTime, EndTime)
    ),

    % Find an available room for the surgery
    find_available_room(Date, StartTime, EndTime, Room),

    % Assign the surgery to the room
    assign_surgery_to_room(Room, Date, Surgery, StartTime, EndTime).

% Find an available room for the surgery based on the time
find_available_room(Date, StartTime, EndTime, Room) :-
    findall(
        Room,
        (   agenda_operation_room(Room, Date, Agenda),
            \+ member((StartTime, EndTime, _), Agenda)  % Room is available during the given time
        ),
        AvailableRooms),
    AvailableRooms \= [],
    member(Room, AvailableRooms).

% Assign surgery to the operation room's schedule
assign_surgery_to_room(Room, Date, Surgery, StartTime, EndTime) :-
    agenda_operation_room(Room, Date, Agenda),
    % Avoid duplicates in the room's schedule
    (   member((StartTime, EndTime, Surgery), Agenda)
    ->  UpdatedAgenda = Agenda
    ;   append(Agenda, [(StartTime, EndTime, Surgery)], UpdatedAgenda)
    ),
    retract(agenda_operation_room(Room, Date, Agenda)),
    assertz(agenda_operation_room(Room, Date, UpdatedAgenda)).

% Find earliest available time for all staff
find_earliest_available_team(Date, StaffList, TotalTime, StartTime, EndTime) :-
    % Collect all staff availability slots in one go
    findall(
        StaffSlots,
        (   member(Staff, StaffList),
            availability(Staff, Date, StaffSlots)
        ),
        AllStaffSlots
    ),
    % Find the common available slot for all staff
    find_common_slot(AllStaffSlots, TotalTime, StartTime, EndTime).

% Find the earliest common slot that fits the surgery
find_common_slot(AllStaffSlots, TotalTime, StartTime, EndTime) :-
    % Find the available slots for all staff that can accommodate the total surgery time
    find_available_slots(AllStaffSlots, TotalTime, AvailableSlots),
    sort(AvailableSlots, SortedSlots),
    member((StartTime, EndTime), SortedSlots),
    fits_for_all_staff(AllStaffSlots, (StartTime, EndTime)).

% Find all possible available time slots that fit the surgery duration
find_available_slots(AllStaffSlots, TotalTime, AvailableSlots) :-
    findall(
        (Start, EndSlot),
        (   member(StaffSlots, AllStaffSlots),
            member((Start, End), StaffSlots),
            Duration is End - Start + 1,
            Duration >= TotalTime,
            EndSlot is Start + TotalTime - 1
        ),
        AvailableSlots
    ).

% Check if the time slot fits for all staff
fits_for_all_staff([], _).
fits_for_all_staff([StaffSlots | Rest], (StartTime, EndTime)) :-
    member((Start, End), StaffSlots),
    Start =< StartTime,
    End >= EndTime,
    fits_for_all_staff(Rest, (StartTime, EndTime)).

% Assign surgery to staff and update their schedule
assign_to_staff(Staff, Date, Surgery, StartTime, EndTime) :-
    retract(availability(Staff, Date, Slots)),
    update_schedule(Slots, (StartTime, EndTime), UpdatedSlots),
    assertz(availability(Staff, Date, UpdatedSlots)),

    % Update the agenda for the staff
    update_agenda_staff(Staff, Date, Surgery, StartTime, EndTime).

% Update agenda for staff
update_agenda_staff(Staff, Date, Surgery, StartTime, EndTime) :-
    (   retract(agenda_staff(Staff, Date, Agenda))
    ->  true
    ;   Agenda = []
    ),
    % Avoid duplicates in the agenda
    (   member((StartTime, EndTime, Surgery), Agenda)
    ->  UpdatedAgenda = Agenda
    ;   append(Agenda, [(StartTime, EndTime, Surgery)], UpdatedAgenda)
    ),
    assertz(agenda_staff(Staff, Date, UpdatedAgenda)).

% Update availability schedule after assigning a time slot
update_schedule([], _, []).
update_schedule([(Start, End) | Rest], (StartTime, EndTime), UpdatedSlots) :-
    (End < StartTime; Start > EndTime),
    !,
    update_schedule(Rest, (StartTime, EndTime), RemainingSlots),
    UpdatedSlots = [(Start, End) | RemainingSlots].
update_schedule([(Start, End) | Rest], (StartTime, EndTime), UpdatedSlots) :-
    % Adjust slot before and after the assigned time
    NewStart is max(Start, EndTime + 1),
    NewEnd is min(End, StartTime - 1),
    findall(
        Slot,
        (   Slot = (SlotStart, SlotEnd),
            member((SlotStart, SlotEnd), [(Start, NewEnd), (NewStart, End)]),
            SlotStart =< SlotEnd
        ),
        AdjustedSlots
    ),
    update_schedule(Rest, (StartTime, EndTime), RemainingSlots),
    append(AdjustedSlots, RemainingSlots, UpdatedSlots).

%--------------------------------------------- Second Heuristic --------------------------------------------------------------%

heuristic_all_staff(Room, Day, Solution, FinalTime, ExecutionTime):-
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

    % obter tempo livre para todo o staff
    find_free_agendas(Day),

    % obter todas as cirurgias não agendadas
    findall(OpCode, surgery_id(OpCode,_), AllSurgeries),
    schedule_surgeries_all_staff(Room, Day, AllSurgeries),

    % obter a agenda final
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

% agendar cirurgias considerando todo o staff
schedule_surgeries_all_staff(_, _, []).
schedule_surgeries_all_staff(Room, Day, Surgeries) :-
    % calcular a ocupação média das equipes para cada cirurgia
    calculate_teams_occupation(Day, Surgeries, TeamOccupationRates),

    % encontrar cirurgia com equipe de maior taxa de ocupação média
    find_highest_team_occupation(TeamOccupationRates, NextSurgery, _),

    % tentar agendar a cirurgia selecionada
    (
        availability_all_surgeries([NextSurgery], Room, Day),
        % remover cirurgia da lista
        delete(Surgeries, NextSurgery, RemainingSurgeries),
        % continuar com as cirurgias restantes
        schedule_surgeries_all_staff(Room, Day, RemainingSurgeries)
    ;
        % se falhar, tentar próxima cirurgia
        delete(Surgeries, NextSurgery, RemainingSurgeries),
        schedule_surgeries_all_staff(Room, Day, RemainingSurgeries)
    ).

% calcular taxa de ocupação das equipes para cada cirurgia
calculate_teams_occupation(Day, Surgeries, TeamOccupationRates) :-
    findall((Surgery, Rate),
            (member(Surgery, Surgeries),
             calculate_surgery_team_rate(Surgery, Day, Rate)),
            TeamOccupationRates).

% calcular taxa de ocupação média da equipe para uma cirurgia
calculate_surgery_team_rate(Surgery, Day, AverageRate) :-
    % obter todos os membros da equipe necessários para a cirurgia
    findall(Staff, assignment_surgery(Surgery, Staff), TeamMembers),

    % calcular taxa de ocupação para cada membro
    findall(Rate,
            (member(Staff, TeamMembers),
             calculate_staff_rate(Staff, Day, Surgery, Rate)),
            Rates),

    % calcular média das taxas
    sum_list(Rates, TotalRate),
    length(Rates, NumMembers),
    (NumMembers > 0,
     AverageRate is TotalRate / NumMembers
    ;
     AverageRate = 0).

% calcular taxa de ocupação para um membro do staff
calculate_staff_rate(Staff, Day, Surgery, Rate) :-
    % calcular tempo total disponível
    availability(Staff, Day, FreeSlots),
    sum_available_time(FreeSlots, AvailableTime),

    % obter duração da cirurgia
    surgery_id(Surgery, Type),
    surgery(Type, TAnesthesia, TSurgery, TCleaning),
    Duration is TAnesthesia + TSurgery + TCleaning,

    % calcular taxa
    (AvailableTime > 0,
     Rate is (Duration / AvailableTime) * 100
    ;
     Rate = 0).

% soma do tempo disponível
sum_available_time([], 0).
sum_available_time([(Start, End)|Rest], Total) :-
    sum_available_time(Rest, RestTotal),
    Total is RestTotal + (End - Start + 1).

% encontrar cirurgia com maior taxa de ocupação média da equipe
find_highest_team_occupation([], none, 0).
find_highest_team_occupation([(Surgery, Rate)|Rest], HighestSurgery, HighestRate) :-
    find_highest_team_occupation(Rest, RestSurgery, RestRate),
    (Rate > RestRate,
     HighestSurgery = Surgery,
     HighestRate = Rate
    ;
     HighestSurgery = RestSurgery,
     HighestRate = RestRate).