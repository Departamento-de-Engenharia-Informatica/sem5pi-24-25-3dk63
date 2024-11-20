% Definindo o staff (ID, tipo de staff, especialização)
staff(d001, doctor, orthopaedist).
staff(d002, doctor, orthopaedist).
staff(d003, doctor, neurologist).

% Lista de cirurgias que cada especialização pode realizar
specialization_surgeries(orthopaedist, [so2, so3, so4]).
specialization_surgeries(neurologist, [so5, so6]).

% Lista inicial de staff com o número de operações e as cirurgias atribuídas
staff_list([(0, d001, []), (0, d002, []), (0, d003, [])]).

surgery_id(so100001, so2).
surgery_id(so100002, so3).
surgery_id(so100003, so4).
surgery_id(so100004, so5).
surgery_id(so100005, so6).

% Atribui uma cirurgia ao staff de acordo com a especialização e balanceamento
assign_surgery(OpCode, [(Ops, StaffId, Surgeries)|Rest], [(NewOps, StaffId, NewSurgeries)|Rest]) :-
    staff(StaffId, doctor, Specialization),
    specialization_surgeries(Specialization, AvailableSurgeries),
    member(OpCode, AvailableSurgeries),
    NewOps is Ops + 1,
    NewSurgeries = [OpCode|Surgeries].

% Processa os outros staffs recursivamente
assign_surgery(OpCode, [(_, _, _) | Rest], UpdatedStaffList) :-
    assign_surgery(OpCode, Rest, UpdatedStaffList).

% Planeja todas as cirurgias para todos os staffs
schedule_all_surgeries(Room, Day) :-
    % Limpa as agendas e disponibilidades anteriores
    retractall(agenda_staff1(_, _, _)),
    retractall(agenda_operation_room1(_, _, _)),
    retractall(availability(_, _, _)),

    % Copia as agendas iniciais para as bases temporárias
    findall(_, (agenda_staff(D, Day, Agenda), assertz(agenda_staff1(D, Day, Agenda))), _),
    agenda_operation_room(Room, Day, AgendaRoom),
    assertz(agenda_operation_room1(Room, Day, AgendaRoom)),

    % Adapta horários de disponibilidade e cria lista de códigos de cirurgia
    findall(_, (agenda_staff1(D, Day, L), free_agenda0(L, LFA), adapt_timetable(D, Day, LFA, LFA2), assertz(availability(D, Day, LFA2))), _),
    findall(OpCode, surgery_id(OpCode, _), LOpCode),

    % Inicializa a lista de staff
    staff_list(StaffList),

    % Planeja todas as cirurgias, atualizando a lista de staff
    plan_surgeries(LOpCode, StaffList, UpdatedStaffList),
    assertz(updated_staff_list(UpdatedStaffList)).

% Planeja as cirurgias com base nas especializações dos médicos e balanceamento
plan_surgeries([], StaffList, StaffList).
plan_surgeries([OpCode|Rest], StaffList, FinalStaffList) :-
    assign_surgery(OpCode, StaffList, UpdatedStaffList),
    plan_surgeries(Rest, UpdatedStaffList, FinalStaffList).
