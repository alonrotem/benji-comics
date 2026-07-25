$(document).ready(function() {
    // 1. Inject DOM nodes sequentially
    for (var i = 1; i <= totalPages; i++) {
        var pageNum = i < 10 ? '0' + i : i;
        var pageDiv = $('<div class="page-node"></div>');
        var img = $('<img src="./pages/' + pageNum + '.png" alt="Page ' + pageNum + '">');
        
        // Track standard item caching completions safely
        img.on('load error', function() {
            loadedCount++;
            var percent = Math.round((loadedCount / totalPages) * 100);
            $("#load-progress").text("Loading pages (" + percent + "%)");
            
            if (loadedCount === totalPages) {
                initializeBooklet();
            }
        });

        pageDiv.append(img);
        flipbook.append(pageDiv);
    }

    // 2. Setup dynamic button hide behaviors
    function updateNavigationButtons(currentPage) {
        // Fade out left arrow if looking at front cover
        if (currentPage === 1) {
            $("#prev-btn").css({ "opacity": "0", "pointer-events": "none" });
        } else {
            $("#prev-btn").css({ "opacity": "1", "pointer-events": "auto" });
        }

        // Fade out right arrow if looking at back cover
        if (currentPage === totalPages) {
            $("#next-btn").css({ "opacity": "0", "pointer-events": "none" });
        } else {
            $("#next-btn").css({ "opacity": "1", "pointer-events": "auto" });
        }
    }

    // 3. Core Engine Initialization
    function initializeBooklet() {
        flipbook.turn({
            width: 800,
            height: 500,
            page: 1,         // Force engine instantiation onto page 1 index
            autoCenter: true,
            duration: 350,   
            acceleration: true,
            gradients: true,
            elevation: 0,    
            pages: totalPages,
            when: {
                turning: function(e, page, view) {
                    if (page == 1 || page == totalPages) {
                        flipbook.turn('corner', 'null');
                    }
                },
                turned: function(e, page, view) {
                    // Update arrow buttons whenever a page turn finishes
                    updateNavigationButtons(page);
                }
            }
        });

        // Closable/Hard Cover configuration behaviors for terminal leaves
        flipbook.turn('page', 1).addClass('hard');
        flipbook.turn('page', totalPages).addClass('hard');

        // explicit fallback to absolute index grid root position
        flipbook.turn('page', 1);

        // Run layout dimension engine scaling pass
        resizeBook();

        // Make book visible and dissolve loader screen graphics safely
        $("#flipbook-wrapper").css("visibility", "visible");
        updateNavigationButtons(1); // Run button hide logic for initial state

        $("#loader-overlay").css("opacity", 0);
        setTimeout(function() { 
            $("#loader-overlay").remove(); 
        }, 500);
    }

    // 4. Geometry Scaling framework 
    function resizeBook() {
        if (!flipbook.turn('is')) return;

        var viewW = $(window).width();
        var viewH = $(window).height();

        var targetH = viewH * 0.96; 
        var targetW = targetH * baseRatio;

        if (viewW < 768) {
            flipbook.turn('display', 'single');
            targetW = viewW * 0.92;
            targetH = targetW / (baseRatio / 2);
            if (targetH > viewH * 0.92) {
                targetH = viewH * 0.92;
                targetW = targetH * (baseRatio / 2);
            }
        } else {
            if (targetW > viewW * 0.90) {
                targetW = viewW * 0.90;
                targetH = targetW / baseRatio;
            }
            flipbook.turn('display', 'double');
        }

        $("#flipbook-wrapper").css({ width: targetW, height: targetH });
        flipbook.turn('size', targetW, targetH);
    }

    $(window).resize(function() {
        resizeBook();
    });

    // 5. User Control Interactivity mappings
    $("#next-btn").click( function(e) {
        e.preventDefault();
        if (flipbook.turn('is')) 
            flipbook.turn("next");
    });
    $("#prev-btn").click(function(e) {
        e.preventDefault();
        if (flipbook.turn('is')) 
            flipbook.turn("previous");
    });
    $(document).keydown(function(e) {
        if (!flipbook.turn('is')) 
            return;
        if (e.keyCode === 37) {
            flipbook.turn("previous");
        } 
        else if (e.keyCode === 39) {
            flipbook.turn("next");
        }
    });
});