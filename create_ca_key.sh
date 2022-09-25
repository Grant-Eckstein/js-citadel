set -x
mkdir cert && cd cert
openssl genrsa -des3 -out ca.key 2048
openssl req -x509 -new -nodes -key ca.key -sha256 -days 1825 -out ca.pem
openssl req -newkey rsa:2048 -new -nodes -keyout ca.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey ca.pem -out server.crt