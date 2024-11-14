using AutoMapper;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.SurgeryRooms.ValueObjects;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;

namespace Backend.Domain.SurgeryRoom
{
    public class SurgeryRoomService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISurgeryRoomRepository _surgeryRoomRepository;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public SurgeryRoomService(IUnitOfWork unitOfWork, ISurgeryRoomRepository surgeryRoomRepository, IConfiguration configuration, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _surgeryRoomRepository = surgeryRoomRepository;
            _configuration = configuration;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SurgeryRoomDTOStrings>> GetAllAsync()
        {
            var surgeryRoomEntities = await _surgeryRoomRepository.GetAllAsync();

            var surgeryRoomDtos = surgeryRoomEntities.Select(surgeryRoomEntity => new SurgeryRoomDTOStrings
            {
                RoomId = surgeryRoomEntity.Id.AsGuid(),
                RoomNumber = surgeryRoomEntity.RoomNumber.ToString(),
                Type = surgeryRoomEntity.Type.ToString(),
                Capacity = surgeryRoomEntity.Capacity.Value,
                AssignedEquipment = surgeryRoomEntity.AssignedEquipment,
                CurrentStatus = surgeryRoomEntity.CurrentStatus.Value.ToString(),
                MaintenanceSlots = surgeryRoomEntity.MaintenanceSlots
            });

            return surgeryRoomDtos;
        }


        public async Task<SurgeryRoomDTOStrings> GetByRoomNumberAsync(string roomNumber)
        {
            var surgeryRoomEntity = await _surgeryRoomRepository.GetByRoomNumberAsync(roomNumber);

            if (surgeryRoomEntity == null)
            {
                return null;
            }

            return new SurgeryRoomDTOStrings
            {
                RoomId = surgeryRoomEntity.Id.AsGuid(),
                RoomNumber = surgeryRoomEntity.RoomNumber.ToString(),
                Type = surgeryRoomEntity.Type.ToString(),
                Capacity = surgeryRoomEntity.Capacity.Value,
                AssignedEquipment = surgeryRoomEntity.AssignedEquipment,
                CurrentStatus = surgeryRoomEntity.CurrentStatus.Value.ToString(),
                MaintenanceSlots = surgeryRoomEntity.MaintenanceSlots
            };
        }




        public async Task<SurgeryRoomDTOStrings> GetAsync(Guid roomId)
        {
            var roomIdObj = new RoomId(roomId);

            var surgeryRoomEntity = await _surgeryRoomRepository.GetByIdAsync(roomIdObj);

            if (surgeryRoomEntity == null)
            {
                throw new KeyNotFoundException("Surgery room not found.");
            }

            return new SurgeryRoomDTOStrings
            {
                RoomId = surgeryRoomEntity.Id.AsGuid(),
                RoomNumber = surgeryRoomEntity.RoomNumber.ToString(),
                Type = surgeryRoomEntity.Type.Type.ToString(),
                Capacity = surgeryRoomEntity.Capacity.Value,
                AssignedEquipment = surgeryRoomEntity.AssignedEquipment,
                CurrentStatus = surgeryRoomEntity.CurrentStatus.Value.ToString(), 
                MaintenanceSlots = surgeryRoomEntity.MaintenanceSlots
            };
        }


        public async Task<SurgeryRoomDTO> GetByIdAsync(RoomId roomId)
        {
            var surgeryRoomEntity = await _surgeryRoomRepository.GetByIdAsync(roomId);
            return surgeryRoomEntity == null ? null : _mapper.Map<SurgeryRoomDTO>(surgeryRoomEntity);
        }

        public async Task<SurgeryRoomDTO> AddAsync(CreatingSurgeryRoomDto creatingDto)
        {

            if (creatingDto == null)
            {
                throw new ArgumentNullException(nameof(creatingDto), "Creating DTO cannot be null.");
            }

            string domain = _configuration["DNS_DOMAIN"];
            if (string.IsNullOrEmpty(domain))
            {
                throw new BusinessRuleValidationException("O domínio DNS não está configurado corretamente.");
            }


            var surgeryRoomEntity = _mapper.Map<SurgeryRoomEntity>(creatingDto);
            await _surgeryRoomRepository.AddAsync(surgeryRoomEntity);
            await _unitOfWork.CommitAsync();

            return _mapper.Map<SurgeryRoomDTO>(surgeryRoomEntity);
        }

        public async Task<SurgeryRoomDTO> UpdateAsync(SurgeryRoomDTO surgeryRoomDto)
        {
            if (surgeryRoomDto == null)
            {
                throw new ArgumentNullException(nameof(surgeryRoomDto), "SurgeryRoomDTO cannot be null.");
            }

            var existingRoom = await _surgeryRoomRepository.GetByIdAsync(new RoomId(surgeryRoomDto.RoomId));
            if (existingRoom == null)
            {
                throw new BusinessRuleValidationException("Surgery room not found.");
            }

            existingRoom.ChangeRoomNumber(surgeryRoomDto.RoomNumber);
            existingRoom.ChangeRoomType(surgeryRoomDto.Type);
            existingRoom.ChangeCapacity(surgeryRoomDto.Capacity);
            existingRoom.ChangeAssignedEquipment(surgeryRoomDto.AssignedEquipment);
            existingRoom.ChangeCurrentStatus(surgeryRoomDto.CurrentStatus);
            existingRoom.ChangeMaintenanceSlots(surgeryRoomDto.MaintenanceSlots);

            await _unitOfWork.CommitAsync();

            return _mapper.Map<SurgeryRoomDTO>(existingRoom);
        }

        public async Task<SurgeryRoomDTO> DeleteAsync(RoomId roomId)
        {
            var existingRoom = await _surgeryRoomRepository.GetByIdAsync(roomId);
            if (existingRoom == null)
            {
                return null;
            }

            if (existingRoom.CurrentStatus.Value != RoomStatusEnum.Available)
            {
                throw new BusinessRuleValidationException("Cannot delete a surgery room that is not available.");
            }

            this. _surgeryRoomRepository.Remove(existingRoom);
            await _unitOfWork.CommitAsync();

            return _mapper.Map<SurgeryRoomDTO>(existingRoom);
        }

         public async Task<string> CreateJsonAsync()
        {
        var surgeryRoomEntities = await _surgeryRoomRepository.GetAllAsync();

        // Ordenar as salas por ordem crescente
        surgeryRoomEntities = surgeryRoomEntities.OrderBy(s => s.RoomNumber.Value).ToList();

        // Listar os números das salas
        var surgeryRoomNames = surgeryRoomEntities
            .Select(s => s.RoomNumber.ToString())
            .ToList();

        // Criar o mapa
        var map = CreateMap(surgeryRoomEntities);

        // Determinar largura e altura do mapa
        var width = map[0].Count - 1;
        var height = map.Count-1;

        // Estrutura JSON para criar o arquivo
        var newJson = new JObject
        {
            ["groundTextureUrl"] = "/../src/Floor/textures/ground.jpg",
            ["wallTextureUrl"] = "/../src/Floor/textures/wall.jpg",
            ["doorTextureUrl"] = "/../src/Floor/textures/door.jpg",
            ["surgeryRoomDoorTextureUrl"] = "/../src/Floor/textures/surgeryDoor.png",
            ["camaTextureUrl"] = "/../src/Floor/textures/bed.obj",
            ["aderecoTextureUrl"] = "/../src/Floor/textures/adereco.obj",
            ["patientTextureUrl"] = "/../src/Floor/textures/ManColors.png",
            ["patientModelOBJUrl"] = "/../src/Floor/textures/Man.obj",
            
            ["size"] = new JObject
            {
                ["width"] = width,
                ["height"] = height
            },
            
            ["map"] = JArray.FromObject(map),

            ["initialPosition"] = new JArray { 4, 5 },
            ["initialDirection"] = 0.0,
            ["exitLocation"] = new JArray { -0.5, 6 },

            // Inclui os nomes das salas no JSON
            ["surgeryRooms"] = JArray.FromObject(surgeryRoomNames)
        };

        // Serializar o JSON em uma string
        var jsonString = JsonConvert.SerializeObject(newJson, Formatting.Indented);
        
        Console.WriteLine("Criando o JSON: ");
        Console.WriteLine(jsonString);

        // Caminho absoluto para o diretório public dentro de web
    string publicDir = Path.Combine(Directory.GetCurrentDirectory(), "..", "web", "public","floor");

    // Certificar-se de que o diretório existe
    if (!Directory.Exists(publicDir))
    {
        Directory.CreateDirectory(publicDir);
    }

    // Caminho para o arquivo JSON
    string filePath = Path.Combine(publicDir, "map.json");

    // Salvar o arquivo JSON no diretório /web/public
    try
    {
        File.WriteAllText(filePath, jsonString);
        Console.WriteLine($"Arquivo JSON salvo em: {filePath}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao salvar o arquivo: {ex.Message}");
    }

    // Retorna o JSON como string (pode ser salvo em arquivo, etc.)
    return jsonString;
}


        
    public static List<List<int>> CreateMap(List<SurgeryRoomEntity> data)
    {
        Console.WriteLine("Creating map with data:");
        data.ForEach(room => Console.WriteLine($"Room status: {room.CurrentStatus}"));

        // Definir os módulos (os arrays de salas)
        var modulo0 = new List<List<int>>
        {
            new List<int> { 3, 2, 2, 2, 3, 5, 2, 3, 2, 2, 2, 1 }
        };

        var moduloIntermedio = new List<List<int>>
        {
            new List<int> { 3, 2, 2, 2, 1, 0, 0, 3, 2, 2, 2, 1 }
        };

        var moduloFim = new List<List<int>>
        {
            new List<int> { 2, 2, 2, 2, 2, 5, 2, 2, 2, 2, 2, 0 }
        };

        //duas fechadas
        var modulo1 = new List<List<int>>
        {
            new List<int> { 1, 0, 0, 0, 6, 0, 0, 6, 0, 0, 0, 1 },
            new List<int> { 1, 0, 9, 0, 6, 0, 0, 6, 0, 9, 0, 1 },
            new List<int> { 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1 }
        };

        //fechada esquerda aberta direita
        var modulo2 = new List<List<int>>
        {
            new List<int> { 1, 0, 0, 0, 6, 0, 0, 8, 0, 0, 0, 1 },
            new List<int> { 1, 0, 9, 0, 6, 0, 0, 8, 0, 4, 0, 1 },
            new List<int> { 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1 }
        };
        //fechada direita aberta esquerda
        var modulo3 = new List<List<int>>
        {
            new List<int> { 1, 0, 0, 0, 7, 0, 0, 6, 0, 0, 0, 1 },
            new List<int> { 1, 0, 4, 0, 7, 0, 0, 6, 0, 9, 0, 1 },
            new List<int> { 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1 }
        };

        var modulo4 = new List<List<int>>
        {
            new List<int> { 1, 0, 0, 0, 7, 0, 0, 8, 0, 0, 0, 1 },
            new List<int> { 1, 0, 4, 0, 7, 0, 0, 8, 0, 4, 0, 1 },
            new List<int> { 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1 }
        };

        // Inicializar o mapa com o modulo0 (inicial)
        var mapa = new List<List<int>>();
        mapa.AddRange(modulo0);
        Console.WriteLine("Adicionado módulo inicial");

        Console.WriteLine("Iterando sobre as salas:", data);

        // Iterar sobre as salas em pares
        for (int i = 0; i < data.Count; i += 2)
        {
            var room1 = data[i];
            var room2 = (i + 1 < data.Count) ? data[i + 1] : null;

            if (room1.CurrentStatus.Value.ToString() =="Occupied" && (room2 == null || room2.CurrentStatus.Value.ToString() =="Occupied"))
            {
                mapa.AddRange(modulo1); // Ambas fechadas
                Console.WriteLine("Ambas fechadas");
            }
            else if (room1.CurrentStatus.Value.ToString() == "Available" && (room2 == null || room2.CurrentStatus.Value.ToString() =="Occupied"))
            {
                mapa.AddRange(modulo3); // Aberta + Fechada (direita)
                Console.WriteLine("Aberta + Fechada (direita)");
            }
            else if (room1.CurrentStatus.Value.ToString() =="Occupied" && room2.CurrentStatus.Value.ToString() == "Available")
            {
                mapa.AddRange(modulo2); // Fechada + Aberta (esquerda)
                Console.WriteLine("Aberta + Fechada (esquerda)");
            }
            else if (room1.CurrentStatus.Value.ToString() == "Available" && room2.CurrentStatus.Value.ToString() == "Available")
            {
                mapa.AddRange(modulo4); // Ambas abertas
                Console.WriteLine("Ambas abertas");
            }

            // Adiciona o módulo intermediário após cada par de salas, exceto o último par
            if (i + 2 < data.Count)
            {
                mapa.AddRange(moduloIntermedio);
            }
        }

        // Adiciona o módulo final
        mapa.AddRange(moduloFim);
        Console.WriteLine("Adicionado módulo final");
        return mapa;
    }

        


    }
}
