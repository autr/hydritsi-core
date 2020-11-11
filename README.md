# HYDRITSI

A live-coding video chat platform built with Jitsi Meet + Hydra Synth + P5.js + TensorFlow 

### Learn

**Hydra Synth**

* [Documentation](https://github.com/ojack/hydra/blob/master/docs/funcs.md)
* [README](https://github.com/ojack/hydra)
* [CODEX HYDRA (es)](https://github.com/ojack/hydra/blob/master/docs/CODEX%20HYDRA.pdf)

**P5.js**

* [Reference Docs](https://p5js.org/reference)
* [Examples](https://p5js.org/examples/)


### Deploy

HydritsiCore is included as a submodule in the root of the Hydritsi [jitsi-meet](https://github.com/autr/jitsi-meet) fork and loaded at runtime:

```
# follow standard jitsi-meet manual installation instructions using fork...

git clone --recursive https://github.com/autr/jitsi-meet hydritsi

```

This means HydritsiCore can be updated without needing to rebuild jitsi-meet:

```
cd hydritsi/hydritsi-core	# goto submodule
git pull 					# pull any latest changes
yarn						# install dependencies
yarn run build				# rebuild scripts

```

### Develop

HydritsiCore can be developed independently of jitsi-meet, using a standard <canvas> and <video> element as a stand-in for the video chat DOM elements used in the main app:

```
cd hydritsi/hydritsi-core	# goto submodule
yarn && yarn run dev 		# run live reload server

# goto http://localhost:5000/#debug

```

JitsiMeet can be run at the same time and will use the compiled output of HydritsiCore:

```
cd hydritsi 				# goto jitsi-meet root
make dev 					# run live reload server
```
