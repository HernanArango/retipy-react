build:
	yarn build
	docker build --rm -f Dockerfile -t alevalv/retipy-react:latest .
start:
	docker run --name retipy-react -d -p 80:80 alevalv/retipy-react:latest
pause:
	docker stop retipy-react
resume:
	docker start retipy-react
stop:
	docker stop retipy-react
	docker rm retipy-react
clean:
	if [ -d "build" ]; then rm -r build; fi
	docker rmi alevalv/retipy-react:latest
