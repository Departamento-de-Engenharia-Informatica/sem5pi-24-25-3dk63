#! /bin/bash

# política padrão para INPUT: bloquear todo tráfego
iptables -P INPUT DROP 

# apagar regras existentes no INPUT
iptables -F INPUT 

# permitir tráfego da rede VPN DEI 
iptables -A INPUT -s 10.8.0.0/16 -j ACCEPT 

# permitir tráfego TCP na porta 22 de forma a autorizar conexões SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT 

# permitir tráfego relacionado ou estabelecido, para permitir respostas do default gateway
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
