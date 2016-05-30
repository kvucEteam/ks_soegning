var active_tab = 0;

var particleSystem;

var soegestreng = "";



$(document).ready(function() {

    generate_tabs();
    make_mindmap(active_tab);
    $(window).resize(resize_window);




});

function resize_window(){
    console.log("resize");
    make_mindmap(active_tab);
}

function generate_tabs() {
    var tabHTML = '';

    for (var i = 0; i < jsonData.Key_probs.length; i++) {
        console.log(jsonData.Key_probs[i].nodes.Key_problem.label);
        tabHTML = tabHTML + '<span class="btn btn-default btn_overordnet">' + jsonData.Key_probs[i].nodes.Key_problem.label + '</span>';
    }


    $('.nav_container').html(tabHTML);

    $('.btn_overordnet').eq(0).addClass("btnPressed");

    $(".btn_overordnet").click(function() {
        if ($(this).hasClass("btnPressed")) {
            console.log("yes");

        } else {
            console.log("no!");
            make_mindmap($(this).index());
        }

        $(".btn_overordnet").removeClass("btnPressed")
        $(this).addClass("btnPressed");

        //clear_rect();


    })
}

function make_mindmap(active_tab) {

    $(".SearchText").val("");
    soegestreng = "";

    var c_width = $(".container-fluid").width();

    $(".canvas_container").html(" <canvas id='viewport' width='" + c_width + "' height='350'></canvas>");

    var w_height = $(window).height(); // New height
    var w_width = $(window).width();

    var sys = arbor.ParticleSystem();

    particleSystem = sys;

    sys.parameters({
        repulsion: 5,
        stiffness: 100,
        friction: .1,
        gravity: true,
        dt: 0.1
    });

    sys.renderer = Renderer("#viewport");

    var data = jsonData.Key_probs[active_tab];

    sys.graft(data);
    sys.screenPadding(0, 0, 0, 0);

    $("canvas").mousedown(function(e) {

        var pos = $(this).offset();
        var p = { x: e.pageX - pos.left, y: e.pageY - pos.top }
        selected = nearest = dragged = particleSystem.nearest(p);


        if (selected.node !== null) {
            selected = (nearest.distance < 50) ? nearest : null;

            console.log(selected);
            console.log(selected.node._id + selected.node.data.label);

            if (soegestreng.indexOf(selected.node.data.label) > -1) {
                console.log("Der er en");
        
                var start = soegestreng.indexOf(selected.node.data.label);
                var n_length = selected.node.data.label.length;
                var slut = start + n_length;
                var ny_soegestreng = soegestreng.substring(0,start) + soegestreng.substring(slut,soegestreng.length);

                        soegestreng = ny_soegestreng;

            } else {
                soegestreng = soegestreng + " " + selected.node.data.label;
            }



            console.log(soegestreng);

            opdater_sogestreng();

            // dragged.node.tempMass = 10000
            dragged.node.fixed = true;
        }
        return false;
    });

    $("canvas").mousemove(function(e) {
        var pos = $(this).offset();
        var p = { x: e.pageX - pos.left, y: e.pageY - pos.top }
        selected = nearest = dragged = particleSystem.nearest(p);

        selected = (nearest.distance < 50) ? nearest : null;
        if (selected !== null) {

            $("canvas").css("cursor", "pointer");

            //console.log(selected);
            // dragged.node.tempMass = 10000
            dragged.node.fixed = true;
        } else {
            $("canvas").css("cursor", "auto");

        }
        return false;
    });

}

function opdater_sogestreng() {
    $("#SearchText").val(soegestreng);
}
