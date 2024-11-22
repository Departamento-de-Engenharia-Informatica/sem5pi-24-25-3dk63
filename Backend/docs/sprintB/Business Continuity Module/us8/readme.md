# 1221959 
# As system administrator I want to get users with more than 3 incorrect accesses attempts

Esta US tem como objetivo obter os utilizadores com mais de 3 acessos incorretos. Para tal, foi feito o seguinte script em bash. 

![Script](/Backend/docs/sprintB/Business%20Continuity%20Module/us8/assets/script.png)

O script pode ser executado com um valor de limites definido pelo System Administrator ou então, por defeito, vai usar o valor 3 para filtrar os acessos incorretos. 

Este script procura o ficheiro /var/log/auth.log, que contém o histórico de logins, por linhas que contenham “Failed Password”, e, usando um map, incrementa por 1 o número de logins errados do utilizador. Se um utilizador exceder o limite de logins errados, será guardado num ficheiro com o formato ‘more_than_N_failed_logins_YYYY-MM-DDTHH:mm:ss.SSSZ.txt’, onde <N> é o número de tentativas falhadas (o limite especificado), e YYYY-MM-DDTHH:mm:ss.SSSZ é a data e hora da execução do script. 

Por uma questão de organização o ficheiro é guardado no diretório “failed_login_files” e, para garantir a proteção dos dados, tem apenas autorização de leitura(read-only). 

Caso de Sucesso: Se o script encontrar utilizadores que ultrapassem o limite de tentativas falhadas, o nome do utilizador e o número de tentativas falhadas são registados no arquivo de saída. 

Caso de Nenhum Resultado: Se nenhum utilizador ultrapassar o limite de tentativas falhadas, o script exibirá a seguinte mensagem: “No users found with more than <N> failed login attemps.”. 

Exemplo de Saída: 

Caso de sucesso sem parâmetro: 

 ![Script](/Backend/docs/sprintB/Business%20Continuity%20Module/us8/assets/sucessosem.png)

Caso de sucesso com parâmetro: 

 ![Script](/Backend/docs/sprintB/Business%20Continuity%20Module/us8/assets/sucessocom.png)

Caso de nenhum resultado: 

 ![Script](/Backend/docs/sprintB/Business%20Continuity%20Module/us8/assets/nenhum.png)

