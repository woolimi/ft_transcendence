# ft_transcendence
## Start
* init rails project
```
rails new [project] -d=postgresql
cp ./init/database.yml ./[project]/config/database.yml
cp ./init/db_exists.rake ./[project]/lib/tasks/db_exists.rake
cp ./init/entrypoint.sh ./[project]/entrypoint.sh
```

* useful docker command
```
// docker
docker run -it [image] [cmd]
docker ps -a
docker rm [id|name]
docker stop [container]
docker start [container]
docker exec -it [container] bash
docker inspect [container id]
// docker compose
docker-copmose up --build
docker-compose up -d
docker-compose logs
docker-compose ps
docker-compose down
docker-compose down --volume
```

## Resources
* [Subject link(en)](https://cdn.intra.42.fr/pdf/pdf/10740/en.subject.pdf)
* [Ruby on rails guide(ko)](https://rubykr.github.io/rails_guides/getting_started.html)
* [Ruby on rails guide(en)](https://guides.rubyonrails.org/getting_started.html)
* [Backbone js official homepage en](https://backbonejs.org/)
* [setup ruby on rails 6 with docker-compose](https://yizeng.me/2019/11/09/setup-a-ruby-on-rails-6-api-project-with-docker-compose/)
