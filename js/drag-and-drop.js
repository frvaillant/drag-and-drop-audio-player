class DragAndDrop {
	constructor(){
		this.dragAble           = null;
		this.counter            = 0;
		this.draggedElements    = null;
		this.originOfElement    = null;

		this.dragableElements   = null;
		this.nameOfInstance     = null;
		// Paramaters initialized in init() function
		this.dragAbleElement    = null;
		this.dropZone           = null;
		this.origin             = null;
		this.draggableClassName = null;
		this.theCounter         = null;
		this.totalZone          = null;
		this.hasADrop           = 0;
		this.music              = null;
		this.audio              = null;
		this.audioTime          = 0;
		this.image              = null;
		this.interval           = null;
		this.audioDuration      = 0;
	}

// Initialisation
    init(params) {
		this.nameOfInstance     = params.instance;
	    this.dropZone           = params.dropZone;
	    this.origin             = params.origin;
	    this.draggableClassName = params.draggableClassName;
	    this.theCounter         = params.theCounter;
	    this.totalZone          = params.totalZone;

	    this.dragableElements   = document.getElementsByClassName(this.draggableClassName);
	    this.addDestinationAttributes ();
	    this.addOriginAttributes ();
	    this.addAttributesDragableElements();
		this.addChildrenAttributes();
		this.audio = document.getElementById('source-audio');
		this.audioControls();
    }

// Attributes

		audioControls () {
			let player  = document.getElementById('playerButton');
			let pauser  = document.getElementById('pauseButton');
			let stopper = document.getElementById('stopButton');

			player.addEventListener('click', () => {
					this.playMyAudio();
			});

			pauser.addEventListener('click', () => {
				this.pauseAudio();
			});

			stopper.addEventListener('click', () => {
				this.stopAudio();
				this.audio.currentTime=0;
			});
		}

    addDestinationAttributes () {
      this.dropZone.setAttribute('ondrop', this.nameOfInstance+'.onDrop(event)');
      this.dropZone.setAttribute('ondragover', this.nameOfInstance + '.onDestinationOver(event)');
    }

    addOriginAttributes () {
      this.origin.setAttribute('ondrop', this.nameOfInstance + '.onDropBack(event)');
      this.origin.setAttribute('ondragover', this.nameOfInstance + '.onOriginOver(event)');
    }

	addChildrenAttributes() {
		for (var i = 0; i < this.dragableElements.length; i++) {
			if (this.dragableElements[i].hasChildNodes()) {
				var children = this.dragableElements[i].childNodes;
				for (var i = 0; i < children.length; i++) {
						children[i].setAttribute('draggable', false);
				}
			}
		}
	}

    addAttributesDragableElements(event) {
		for (let i=0; i<this.dragableElements.length ; i++) {
			this.dragableElements[i].setAttribute('draggable', true);
			this.dragableElements[i].setAttribute('ondragstart', this.nameOfInstance + '.onDragStart(event)');
		}
    }


// Styling elements
	removeShadow (elem) {
		elem.classList.remove('drag-over');
	}

	addShadow (elem) {
		if (!elem.classList.contains('drag-over')) {
        	elem.classList.add ('drag-over');
		}
    }

// Count elements in drop Zone
    updateCounter () {
		if (this.theCounter) {
			this.draggedElements = this.dropZone.querySelectorAll('.'+this.draggableClassName);
			this.counter  = this.draggedElements.length;
			this.theCounter.innerHTML = this.counter;
		}
    }

// Update total price according with data-price attr on draggable elements
	updateTotalPrice (varPrice) {
		if (this.totalZone) {
			this.totalPrice = this.totalPrice + parseFloat(varPrice);
			this.totalZone.innerHTML = Math.round(this.totalPrice * 100) / 100;
		}
    }

	playMyAudio() {
		this.audio.play();
		this.image[0].classList.add('rotate');
		this.getAudioTime(this);
	}

	stopAudio() {
		this.audio.pause();
		this.audio.currentTime=0;
		this.image[0].classList.remove('rotate');
		clearInterval(this.interval);
		this.audio.audioTime=0;
		this.resetProgresser();
	}

	resetProgresser () {
		let p = document.getElementById('theProgresser');
		p.style.width='0%';
	}

	updateProgresser (width) {
		let p = document.getElementById('theProgresser');
		p.style.width=width+'%';
	}

	pauseAudio() {
		this.audio.pause();
		this.image[0].classList.remove('rotate');
		clearInterval(this.interval);
	}

	getAudioTime(my) {
		this.interval = setInterval(function(){
			my.audio.audioTime++;
			let prc = my.audio.audioTime * 100 / my.audio.duration;
			let p = document.getElementById('theProgresser');
			p.style.width=prc+'%';
			if (prc>=100) {
				p.style.width=0+'%';
				clearInterval(this);
				my.stopAudio();
			}
		}, 1000)
	}


// Dragging functions

	onDragStart(ev) {
		this.dragAbleElement = ev.target;
		this.originOfElement = this.dragAbleElement.parentElement;
		this.music = this.dragAbleElement.dataset.music;
    }

    onDrop(ev) {
		this.audio.setAttribute('src', this.music);
		this.audio.audioTime = 0;
		ev.preventDefault();
		if (this.hasADrop===0) {
			this.hasADrop =1 ;
      		this.dropZone.appendChild(this.dragAbleElement);
			this.player_activate();
			this.image = this.dragAbleElement.querySelectorAll('img');
			this.playMyAudio();
		}

		if (this.originOfElement === this.origin) {
			this.updateCounter ();
			this.updateTotalPrice (this.price);
		}
	}

	onDestinationOver(ev) {
		ev.preventDefault();
		this.addShadow(this.dropZone);
    }


    onOriginOver(ev) {
		ev.preventDefault();
    }

    onDropBack(ev) {
		ev.preventDefault();
		if (this.originOfElement !== this.origin) {
			this.origin.appendChild(this.dragAbleElement);
			this.updateCounter ();
			this.updateTotalPrice (-this.price);
			this.hasADrop=0;
			this.stopAudio();
			this.player_deactivate();
			this.image[0].classList.remove('rotate');
			this.resetProgresser();
			clearInterval(this.interval);
			this.audio.setAttribute('src', '');
        }
		this.removeShadow(this.dropZone);
		this.removeShadow(this.origin);
    }

	player_deactivate() {
		document.getElementById('player-controls').classList.remove('activated');
		document.getElementById('progress').classList.remove('activated');
	}

	player_activate() {
		document.getElementById('player-controls').classList.add('activated');
		document.getElementById('progress').classList.add('activated');
	}
}
