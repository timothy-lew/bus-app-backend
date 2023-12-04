# bus-app backend-api

Backend server for bus-app

1. Install nodenv

```console
$ brew install nodenv
```

2. Set up nodenv in your shell by adding this to ~/.zshrc

```console
$ which nodenv > /dev/null && eval "$(nodenv init -)"
```

3. Restart your terminal so your changes take effect.

4. Verify that nodenv is properly set up using this nodenv-doctor script:

```console
$ curl -fsSL https://github.com/nodenv/nodenv-installer/raw/master/bin/nodenv-doctor | bash
Checking for `nodenv' in PATH: /usr/local/bin/nodenv
Checking for nodenv shims in PATH: OK
Checking `nodenv install' support: /usr/local/bin/nodenv-install (node-build 3.0.22-4-g49c4cb9)
Counting installed Node versions: none
  There aren't any Node versions installed under `~/.nodenv/versions'.
  You can install Node versions like so: nodenv install 2.2.4
Auditing installed plugins: OK
```

5. Install node 16.14.2

```console
$ nodenv install 16.14.2
```

6. Installs shims for all Node executables known to nodenv

```console
$ nodenv rehash
```

7. Set node version locally

```console
$ nodenv local 16.14.2
```

8. Install relevant packages

```console
$ npm i
```

9. Run to start backend server

```console
$ npm run dev
```

# Docker

## Build the image

    docker build -t backendapi .

## List the images

    docker images

## Run in detached mode. Container name: backend

    docker run -d --name backend -p 3000:3000 backendapi

## Stop the container

    docker stop backend

# Docker compose

## Build the app

    docker compose build

## Run the app

    docker compose up -d

## Cleanup

    docker compose down

# Kubernetes

## Create the Deployment

    kubectl apply -f deploy-backendapi.yml

## Get the pods list

    kubectl get pods -o wide

## Describe the pod

    kubectl describe pod backendapi

## Get the Deployment info

    kubectl get deploy
    kubectl describe deploy backendapi

## Get the ReplicaSet name

    kubectl get rs

## Describe the ReplicaSet

    kubectl describe rs

## Create the Service

    kubectl apply -f service-backendapi.yml

## Cleanup

    kubectl delete -f deploy-backendapi.yml
    kubectl delete -f service-backendapi.yml
