# HYDRITSI

A live-coding video chat platform built with Jitsi Meet + Hydra Synth + P5.js + TensorFlow 

**Hydra Synth**

* [Documentation](https://github.com/ojack/hydra/blob/master/docs/funcs.md)
* [README](https://github.com/ojack/hydra)
* [CODEX HYDRA (es)](https://github.com/ojack/hydra/blob/master/docs/CODEX%20HYDRA.pdf)

**P5.js**

* [Reference Docs](https://p5js.org/reference)
* [Examples](https://p5js.org/examples/)


### Deploy

HydritsiCore is included as a submodule in the static folder of the [jitsi-meet](https://github.com/autr/jitsi-meet) fork, and loaded at runtime. This means HydritsiCore can be updated without needing to rebuild jitsi-meet:

```
git clone --recursive https://github.com/autr/jitsi-meet jitsi-meet

# follow standard jitsi-meet manual installation instructions using hydritsi fork...

etc

# build hydritsi-core...

cd jitsi-meet/static/hydritsi-core	# goto submodule
git pull 					# pull any latest changes
yarn						# install dependencies
yarn run build				# rebuild scripts
```

A simpler way to install the forked jitsi-meet client is to follow manual instructions, then replace the web app directory in `/usr/share` with the cloned and rebuilt fork of jitsi-meet:

```

# post jitsi-meet install...

cd /usr/share
mv jitsi-meet jitsi-meet-original
git clone --recursive https://github.com/autr/jitsi-meet jitsi-meet
cd jitsi-meet
npm install
make

```



### Develop

HydritsiCore can be developed independently of jitsi-meet, using a standard <canvas> and <video> element as a stand-in for the video chat DOM elements, and activated with a `?debug=1` url query.

```
cd jitsi-meet/static/hydritsi-core	# goto submodule
yarn && yarn run dev 		# run live reload server

# goto http://localhost:5000/?debug=1

```

JitsiMeet can be run at the same time via `make dev` and will reload any recompiled output from HydritsiCore:

```
cd jitsi-meet 				# goto jitsi-meet root
make dev 					# run live reload server
```
