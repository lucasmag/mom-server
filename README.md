# mom-server


## Rodando aplicação em ambiente Local Linux ##

### Instalando o Docker ###

- Instalar docker - https://docs.docker.com/install/linux/docker-ce/ubuntu/

- Os comandos `docker` devem ser rodados com sudo, para roda-los sem sudo, siga os seguintes passos:

    - Passo 1: Adicione o grupo `docker` se ele ainda não existir:

    
    ```bash
    $ sudo groupadd docker
    ```
  
    - Passo 2: Adicione o usuário conectado $USER ao grupo `docker`:
     
    ```bash
    $ sudo gpasswd -a $USER docker
    ```
  
    - Passo 3: Reinicie o `docker daemon`:
    
     ```bash
    $ sudo service docker restart 
    ```
  
    - Observação: Se você está no Ubuntu 14.04-15.10, use `docker.io` em vez de `docker`:
    
    ```bash
    $ sudo service docker.io restart
    ``` 

    - Passo 4: Mude o grupo para  `docker`:
    
     ```bash
    $ newgrp - docker
    ```
    
- Verificar instalação do Docker

```bash
$ docker -v
Docker version 19.03.5, build 633a0ea
```


### Setup RabbitMq ###
- Criar imagem a partir do DockerFile

  - Passo 1: Entre na pasta raíz do projeto `./mom-server` e rode o seguinte comando:
  
    ```bash
    $ docker build . --tag rabbitimg && docker run -d --hostname myrabbit --name rabbit -p 5672:5672 -p 15672:15672 rabbitimg
    ```
 
    - obs.: Certifique-se de que não exista nenhum processo rodando em alguma das portas: **5672, 15672**

    - Você pode fazer a verificação seguindo os seguintes passos:

        - Passo 1: Rode o seguinte código, informando uma das portas, por exemplo:

        ```bash
        $ sudo lsof -i :5672
        ```

        - A saída será nesse formato:

        ```bash
        COMMAND     PID USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
        docker-pr 14817 root    4u  IPv6 1776586      0t0  TCP *:rabbitmq (LISTEN)
        ```

        - Passo 2: Mate a aplicação utilizando o `PID` informado no comando anterior:

        ```bash
        $ sudo kill -9 14817
        ```
  
- Após a instalação o painel de controle do RabbitMq poderá ser acessado pelo endereço **http://localhost:15672**

  obs.: Username: guest  
        Password: guest

## Setup do projeto
```
yarn install
```

### Inicia projeto como desenvolvedor
```
yarn electron:serve
```

### Compila e minifica para produção
```
yarn electron:build
```
