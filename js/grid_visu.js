var combined = null;
var combined_shift = null;
var publisher = null;


// set up all visualizations at page initialization
document.addEventListener("DOMContentLoaded", function(event) {
  combined = new combined_visu('#bbs','out_bb','3','13',null,'');
  combined_shift = new combined_visu('#shift','out_shift','3','13',10,'_2');

  publisher = new img_publisher('#select_canvas');

  plot_layer = ['75','103','104','105'];
  plot_neurons = ['x','y','w','h','c','p'];

  subs = [];

  for(var i=0;i<plot_layer.length;++i) {
	  for(var j=0;j<plot_neurons.length;++j) {
		  subs.push(new img_subscriber('#canvas_'+plot_layer[i]+'_'+plot_neurons[j],'figs/gradcam_out/13/'+plot_layer[i]+'/'+plot_neurons[j]+'/'));
	  }
  }
	  


  for(var i=0;i<subs.length;++i) {
		publisher.register_subscriber(subs[i]);
	  }




	opt_loc = new combined_visu_simple('#optloc','opt_loc/zebra');


var range_canv_id = 'opt_height';
var range_slider_id = 'height_slide';


var range_path = 'opt_height/exp3/person';

var slider = document.getElementById(range_slider_id);

quadratic_canv('#'+range_canv_id);

change_canv_img('#'+range_canv_id,'gfx/instruction2.jpg');

slider.oninput = function(){
	var img_path = 'figs/'+range_path+'/'+pad(this.value,2)+'.jpg';

	change_canv_img('#'+range_canv_id,img_path);
	
	};

});





class combined_visu_simple {
	constructor(canv_id, root_dir) {
		this.canvas = $(canv_id);
		this.canv_id = canv_id;
		this.root_dir = root_dir;
		quadratic_canv(canv_id);
		change_canv_img(this.canv_id, 'gfx/instruction.jpg')

		 
		 this.canvas[0].addEventListener('mousemove', e => {
			var mouse = get_mouse_xy(this.canvas[0],e);
			var grid_pos = [(mouse[0]/this.canvas.width()),(mouse[1]/this.canvas.height())];
			this.update_image(grid_pos);
		}, true);


	  this.canvas[0].addEventListener('mouseout', e => {
	  	change_canv_img(this.canv_id, 'gfx/instruction.jpg')
	  }, true);

		}

	update_image(grid_pos) {
		var num = 13;
        var gy = Math.floor(grid_pos[0]*num);
        var gx = Math.floor(grid_pos[1]*num);
        var file_name = 'figs/'+this.root_dir+'/'+pad(gx,2)+'_'+pad(gy,2)+'.jpg';
        change_canv_img(this.canv_id,file_name);

	}

    init() {
        
    }

}







// combined visualization (image select, size select, combined canvas for hovering and visualization)
class combined_visu {
	constructor(canv_id, root_dir,base_img, size_bb,num_imgs,name_suffix) {
		this.canvas = $(canv_id);
		this.canv_id = canv_id;
		this.base_img = base_img;
		this.size_bb = size_bb;
		this.root_dir = root_dir;
		this.num_imgs = num_imgs;
		this.name_suffix = name_suffix;
		quadratic_canv(canv_id);
		change_canv_img(this.canv_id, 'gfx/instruction.jpg')

		 
		 this.canvas[0].addEventListener('mousemove', e => {
			var mouse = get_mouse_xy(this.canvas[0],e);
			var grid_pos = [(mouse[0]/this.canvas.width()),(mouse[1]/this.canvas.height())];
			this.update_image(grid_pos);
		}, true);


	  this.canvas[0].addEventListener('mouseout', e => {
	  	change_canv_img(this.canv_id, 'gfx/instruction.jpg')
	  }, true);

        this.change_image(base_img);
        this.change_size(size_bb);
		 
		}

	update_image(grid_pos) {
		var num = this.num_imgs ? this.num_imgs : parseInt(this.size_bb);
        var gx = Math.floor(grid_pos[0]*num);
        var gy = Math.floor(grid_pos[1]*num);
        var file_name = 'figs/'+this.root_dir+'/'+this.base_img+'/'+this.size_bb+'/img_'+pad(gx,5)+'_'+pad(gy,5)+'.jpg';
        change_canv_img(this.canv_id,file_name);

	}

    init() {
        
    }

    set_num_imgs(num_imgs) {
    	this.num_imgs = num_imgs;
    }

    set_name_suffix(suffix) {
    	this.name_suffix = suffix;
    }

    change_size(new_size){
    	this.size_bb = new_size;
    	this.init();
		
        var all = document.getElementsByClassName('size_select_img'+this.name_suffix);
		for (var i = 0; i < all.length; i++) {
		  all[i].style.border = '';
		}
        document.getElementById('ss_'+new_size+this.name_suffix).style.cssText = 'border-bottom: 5px solid black';
    }
    change_image(new_img){
    	this.base_img = new_img;
    	this.init();
		
        var all = document.getElementsByClassName('fig_select_img'+this.name_suffix);
		for (var i = 0; i < all.length; i++) {
		  all[i].style.border = '';
		}
        document.getElementById('fs_'+new_img+this.name_suffix).style.cssText = 'border-bottom: 5px solid black';
    }


}


















// publisher class for updating subscriber based on mouse hovering events
class img_publisher {
	constructor(canv_id) {
		this.subscriber = [];
		this.canvas = $(canv_id);
		this.canv_id = canv_id;
		
		 quadratic_canv(canv_id);
		 change_canv_img(this.canv_id, 'gfx/instruction.jpg')

		 
		 this.canvas[0].addEventListener('mousemove', e => {
			var mouse = get_mouse_xy(this.canvas[0],e);
			var grid_pos = [(mouse[0]/this.canvas.width()),(mouse[1]/this.canvas.height())];
			this.update_subscriber(grid_pos);
		}, true);


	  this.canvas[0].addEventListener('mouseout', e => {
	  	change_canv_img(this.canv_id, 'gfx/instruction.jpg')
	  }, true);

		 
		}

	register_subscriber(subscriber) {
		this.subscriber.push(subscriber);
	}

	update_subscriber(grid_pos) {
		for(var i=0;i<this.subscriber.length;++i) {
			this.subscriber[i].update(grid_pos);
		}
	}
}

// subscriber class for updating canvas based on published events
class img_subscriber {
	constructor(canv_id, img_path){
		this.canv_id = canv_id;
		this.img_path = img_path;

		quadratic_canv(canv_id);


	}
	
	update(grid_pos) {
		var start_i = 2;
		var num = 9;
        var gx = Math.floor(grid_pos[0]*num+start_i);
        var gy = Math.floor(grid_pos[1]*num+start_i);
        var file_name = this.img_path+'/img_'+pad(gx,5)+'_'+pad(gy,5)+'.jpg';
        change_canv_img(this.canv_id,file_name);

	}
}













//
// helper functions
//


//make canvas squared (take width as reference)
function quadratic_canv(canv) {
	canv = $(canv);
    s = canv.width();
	canv.css('width',s);
	canv.css('height',s);
    canv[0].width = s;
    canv[0].height = s;
}

//change canvas image
function change_canv_img(canv, img) {
	canv = $(canv);

	var context = canv[0].getContext('2d');

	base_img_file = new Image;
	base_img_file.src = img;
	base_img_file.onload = function() {
		context.drawImage(this, 0,0, 416, 416,0,0,canv[0].width,canv[0].height);
	};

}


// padding numbers with trailing 0's
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

// get mouse position on any canvas by canvas and mouse event
function get_mouse_xy(c, e) {
  var element = c, offsetX = 0, offsetY = 0, mx, my;
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }
  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;

  //add scroll position on top
  //mx = mx + $('#canvas_container').scrollLeft();

  return [mx,my];
}

