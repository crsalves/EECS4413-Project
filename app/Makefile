# Makefile for app to manage docker containers services (database, backend, and frontend)
# This is a script that defines rules and shortcuts for automating tasks.
# The commands are executed in the terminal using the 'make' (example: 'make build')
#
# @file Makefile
# @author Carla da Silva Alves

build:
	docker-compose -f docker-compose.yml create --build

start:
	docker-compose -f docker-compose.yml start

stop:
	docker-compose -f docker-compose.yml stop

down:
	docker-compose -f docker-compose.yml down

start-db:
	docker-compose -f docker-compose.yml up -d database-pet-store

rebuild-db:
	docker-compose -f docker-compose.yml down database-pet-store
	docker-compose -f docker-compose.yml up -d --build database-pet-store

rebuild-api:
	docker-compose -f docker-compose.yml down backend-pet-store
	docker-compose -f docker-compose.yml up -d --build backend-pet-store

rebuild-ui:
	docker-compose -f docker-compose.yml down frontend-pet-store
	docker-compose -f docker-compose.yml up -d --build frontend-pet-store

run-app: down build start 
stop-app: stop down