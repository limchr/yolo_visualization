  var base_img = '0'
  var img_dir = 'figs';
  var gfx_dir = 'gfx';

  var base_img_dir = 'static-grad';


  var control_canv_id = 'control_canv';

  var visus = [
  ['bbs', '--l_x-----', 13, 13, 1, 1],
  ['bbs', '-m-_x-----', 13, 13, 2, 2],
  ['bbs', 's--_x-----', 13, 13, 4, 4],

  ['static-grad', '--l_x-----', 13, 13, 1, 1],
  ['static-grad', '--l_-y----', 13, 13, 1, 1],
  ['static-grad', '--l_--w---', 13, 13, 1, 1],
  ['static-grad', '--l_---h--', 13, 13, 1, 1],
  
  ['static-grad', '-m-_x-----', 13, 13, 2, 2],
  ['static-grad', '-m-_-y----', 13, 13, 2, 2],
  ['static-grad', '-m-_--w---', 13, 13, 2, 2],
  ['static-grad', '-m-_---h--', 13, 13, 2, 2],

  ['static-grad', 's--_x-----', 13, 13, 4, 4],
  ['static-grad', 's--_-y----', 13, 13, 4, 4],
  ['static-grad', 's--_--w---', 13, 13, 4, 4],
  ['static-grad', 's--_---h--', 13, 13, 4, 4],

  ];


document.addEventListener("DOMContentLoaded", function(event) {
  register_visu();
});

function reload_visu() {
  register_visu();
}

function register_visu() {

	for(i=0;i<visus.length;++i) {
			v = visus[i];
			quadratic_canv($('#'+v[0]+'_'+v[1]));
			change_canv_img($('#'+v[0]+'_'+v[1]), gfx_dir+'/instruction.jpg');
	}
	
	canvs = $('.'+control_canv_id);

	for(i=0;i<canvs.length;++i){
		canv = canvs[i];
		quadratic_canv(canv);
		change_canv_img(canv,img_dir+'/'+base_img+'/base_img.jpg');

		canv.addEventListener('mousemove', function(e) {
			var mouse = get_mouse_xy(this,e);
			var grid_pos = [(mouse[0]/this.width),(mouse[1]/this.height)];
			//console.log(grid_pos);
			for(i=0;i<visus.length;++i) {
				var v = visus[i];
				var pos_ind = [Math.floor(grid_pos[0]*v[2]),Math.floor(grid_pos[1]*v[3])];
				var file_name = img_dir+'/'+base_img+'/'+v[0]+'/'+v[1]+'_'+pad(pos_ind[0]*v[4],5)+'_'+pad(pos_ind[1]*v[5],5)+'.jpg';
				change_canv_img($('#'+v[0]+'_'+v[1]), file_name);

			}

		}, true);


	  canv.addEventListener('mouseout', function(e) {
		for(i=0;i<visus.length;++i) {
				var v = visus[i];
				change_canv_img($('#'+v[0]+'_'+v[1]),img_dir+"/instruction.jpg");
			}
	  }, true);


	}

}



function unregister_visu() {
  $('.visu').html('');
}


function quadratic_canv(canv) {
	canv = $(canv);
    s = canv.width();
	canv.css('width',s);
	canv.css('height',s);
    canv[0].width = s;
    canv[0].height = s;
}
function change_canv_img(canv, img) {
		canv = $(canv);

	var context = canv[0].getContext('2d');

	
	
	base_img_file = new Image;
	base_img_file.src = img;
	base_img_file.onload = function() {
		context.drawImage(this, 0,0, 416, 416,0,0,canv[0].width,canv[0].height);
	};

}



function register_grid_visu_old(outer_div_id, base_img, img_dir, base_dir, sub_img_prefix, num_x, num_y, mul_x, mul_y) {
    outer_div = $('#'+outer_div_id);
    outer_div.append('<canvas id="'+outer_div_id+'_left_canvas" class="canv"/>');
    outer_div.append('<canvas id="'+outer_div_id+'_right_canvas" class="canv"/>');

    canv_left = $('#'+outer_div_id+'_left_canvas');
    canv_right = $('#'+outer_div_id+'_right_canvas');

    s = canv_left.width();

    canv_left[0].width = s;
    canv_left[0].height = s;
    canv_right[0].width = s;
    canv_right[0].height = s;

    var cl = canv_left[0].getContext('2d');
    var cr = canv_right[0].getContext('2d');


    canv_left[0].base_img = base_img;
    canv_left[0].img_dir = img_dir;
    canv_left[0].base_dir = base_dir;
    canv_left[0].sub_img_prefix = sub_img_prefix;
    canv_left[0].num_x = num_x;
    canv_left[0].num_y = num_y;
    canv_left[0].mul_x = mul_x;
    canv_left[0].mul_y = mul_y;
    canv_left[0].cr = cr;


//     $('<img src="'+ img_dir+"/"+base_img+"/"+base_img+".jpg" +'">').load(function(){
//         cl.drawImage(this, 0,0,this.width,this.height);

//     });

  base_img_file = new Image;
	base_img_file.src = img_dir+"/"+base_img+"/base_img.jpg";
	base_img_file.onload = function() {
	    cl.drawImage(this, 0,0, 416, 416,0,0,canv_left[0].width,canv_left[0].height);
	};

  base_img_file = new Image;
  base_img_file.src = gfx_dir+"/instruction.jpg";
  base_img_file.onload = function() {
      cr.drawImage(this, 0,0, 416, 416,0,0,canv_right[0].width,canv_right[0].height);
  };


	canv_left[0].addEventListener('mousemove', function(e) {
		var mouse = get_mouse_xy(this,e);
        
    var grid_pos = [Math.floor((mouse[0]/this.width)*this.num_x),Math.floor((mouse[1]/this.height)*this.num_y)];


    file_name = this.img_dir+'/'+this.base_img+'/'+this.base_dir+'/'+this.sub_img_prefix+'_'+pad(grid_pos[0]*mul_x,5)+'_'+pad(grid_pos[1]*mul_y,5)+'.jpg';

		base_img_file = new Image;
		base_img_file.src = file_name;
		base_img_file.onload = function() {
			cr.drawImage(this, 0,0, 416, 416,0,0,canv_right[0].width,canv_right[0].height);
		};



	}, true);

  canv_left[0].addEventListener('mouseout', function(e) {

  base_img_file = new Image;
  base_img_file.src = img_dir+"/instruction.jpg";
  base_img_file.onload = function() {
      cr.drawImage(this, 0,0, 416, 416,0,0,canv_right[0].width,canv_right[0].height);
  };
  }, true);

}



function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}


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




function bb_collides_point(bb, point) {
  return point[0] >= bb[0] && point[0] <= bb[1] && point[1] >= bb[2] && point[1] <= bb[3];
}



function draw_line(draw_context, start,end, stroke_style){
    draw_context.beginPath();
    draw_context.strokeStyle = stroke_style;
    draw_context.moveTo(start[0],start[1]);
    draw_context.lineTo(end[0], end[1]);
    draw_context.stroke();
}

function draw_text(draw_context, text,position,size,color,font){
    draw_context.font = size+"px "+font;
    draw_context.fillStyle = color;
    draw_context.fillText(text,position[0],position[1]);
}

function draw_rect(draw_context, pos,stroke_style,fill_style){
    draw_context.strokeStyle = stroke_style;
    draw_context.fillStyle = fill_style;
    draw_context.strokeRect(pos[0],pos[1],pos[2],pos[3]);
    draw_context.fillRect(pos[0],pos[1],pos[2],pos[3]);
}



