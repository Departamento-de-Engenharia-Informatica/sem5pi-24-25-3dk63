#! /bin/bash

# política padrão para INPUT: bloquear todo tráfego
iptables -P INPUT DROP 

# apagar regras existentes no INPUT
iptables -F INPUT 

# permitir tráfego da rede VPN DEI (ajuste o intervalo de IP se necessário)
iptables -A INPUT -s 10.8.0.0/16 -j ACCEPT 

# permitir tráfego para uma porta específica
iptables -A INPUT -p tcp --dport <port> -j ACCEPT 

# permitir tráfego relacionado ou estabelecido
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
