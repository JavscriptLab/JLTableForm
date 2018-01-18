/*
MIT License
Copyright (c) 2017 JavscriptLab https://github.com/JavscriptLab
*/

"use strict";
$.ajaxSetup({
    cache: false
});

$.fn.jltableform = function(opt) {
   
    var t = $(this);
    if (!t.attr('id')) {
        t.attr('id', "Id" + new Date().getTime().toString() + "" + Math.random().toString().replace(".",""));
    }
    var tid = t.attr('id');
    var stn = $.extend({}, $.fn.jltableform.defaults);
    var kv = $.fn.jltableform.keys;
    var mt = $.extend($.fn.jltableform.date, $.fn.jltableform.methods);
    if (typeof opt == 'object') {
        {
            stn = $.extend(stn, opt);
        }
    }
    t.children().attr("data-jltableformrow", "true");
    if (!t.attr("data-jltableforminit")) {
        t.attr('data-jltableforminit', true);
        $('body').on('keydown',
            "#" + tid + '[data-jltableform] .table-row input[name]',
            function (e) {
                if (e.keyCode == 13 && e.originalEvent) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    mt.saveform(t,$(this));
                }
            });
        $('body').on('change blur',
           "#" + tid + '[data-jltableform] .table-row [name]',
            function (e) {
                e.stopImmediatePropagation();
                if (e.originalEvent) {
                    mt.saveform(t, $(this));
                }
            });
       
        $('body').on('keydown',
          "#" + tid + '[data-jltableform] .table-addnewrow [name]',
          function (e) {
              if (e.keyCode == 13 && e.originalEvent) {
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  mt.saveform(t, $(this),true);
              }
          });
        $('body').on('click',
          "#" + tid + '[data-jltableform] .addrow',
           function (e) {
               e.stopImmediatePropagation();
               if (e.originalEvent) {
                   mt.saveform(t, $(this),true);
               }
           });
        
    }
    return $(this);
};
$.fn.jltableform.methods = {
    saveform: function (f, th,newrow) {
        
      
        if (!newrow) {
            var value = th.val();
            if (th.prop("tagName").toLowerCase() == "select") {
                value = th.find("option:selected").text();
            }
            var tobj = th.closest(".form-group").next(".table-cell-content");
                if (tobj.text() == value) {
                    return false;
                }
                var key = th.attr("name").replace("form[", "").replace("]", "");
                
                var attributes = $.fn.binder.methods.attr(tobj);
                value = $.fn.binder.methods.textautofn(attributes, value, tobj);
                value = $.fn.binder.methods.applydatefunctionalitybyattributes(attributes, key, value);
                $.fn.binder.methods.applyfunctionalitybasedonattributes(attributes, tobj, key, value);
                tobj.text(value);
            }

            var formrow = th.closest("[data-jltableformrow]");
            var method = f.attr('data-method') ? f.attr('data-method') : "post";
            var action = f.attr('data-action');
            var formdata = {};
            formdata = $.fn.binder.methods.makepostdata(formrow.find("[name]"));

            // if (f.valid() == true) {
            var postdata = {};
            postdata.formdata = formdata;
            postdata.newrowdata = newrow;
            f.trigger("beforesavetableform", postdata);
            
            $[method](action, postdata.formdata, function (data) {
                var callbinderobjects = $("[data-json='" + f.attr("data-action").replace(/Put/i, "Get") + "']");
                if (f.attr('data-updatebinder') && $(f.attr('data-updatebinder')).binder) {
                    callbinderobjects = callbinderobjects.add($(f.attr('data-updatebinder')));
                }
                if (!newrow) {
                    callbinderobjects = callbinderobjects.not(f);
                }
                if (newrow) {
                    formrow.find("input[name]").val("");
                    formrow.find("select[name]").each(function() {
                        $(this).find("option:first").prop("selected", true);
                    });
                }
                callbinderobjects.binder();
                f.trigger('aftersavetableform', data);

            });
        
       // }
    }
};
$.fn.jltableform.keys = {
};
$.fn.jltableform.defaults = {
};
function focusinput(obj) {
    if (obj.prop("tagName").toLowerCase() == "select") {
        var element = obj[0],
    worked = false;
        if (document.createEvent) { // chrome and safari
            var e = document.createEvent("MouseEvents");
            e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            worked = element.dispatchEvent(e);
        }
    } else {
        var inputField = obj[0];
        if (inputField) {
            if (inputField != null && inputField.value && inputField.value.length != 0) {
                if (inputField.createTextRange) {
                    var FieldRange = inputField.createTextRange();
                    FieldRange.moveStart('character', inputField.value.length);
                    FieldRange.collapse();
                    FieldRange.select();
                } else if (inputField.selectionStart || inputField.selectionStart == '0') {
                    var elemLen = inputField.value.length;
                    inputField.selectionStart = elemLen;
                    inputField.selectionEnd = elemLen;
                    inputField.focus();
                }
            } else {
                inputField.focus();
            }
        }
    }
}
$(document).ready(function () {
    var triggeredkeydown = false;
    var lastkeydown = 0;
    
    var keydownmovements = function (keyCode, th) {
        if (th&&th.length > 0) {
            triggeredkeydown = true;

            var currentinput;
            var input;
            var key = th.attr("name");


            input = th.parent().parent().parent().next().find("[name*='" + key + "'],a.deleterow,a.addrow").first();
            if (keyCode == 40 && input.length > 0) {
                $(".tableformhover").removeClass("tableformhover");
                currentinput = input;
                input.parent().parent().addClass("tableformhover");
                input.focus().parent().parent().addClass("tableformhover");

            }
            input = th.parent().parent().parent().prev().find("[name*='" + key + "'],a.deleterow,a.addrow").first();
            if (keyCode == 38 && input.length > 0) {
                $(".tableformhover").removeClass("tableformhover");
                currentinput = input;
                input.parent().parent().addClass("tableformhover");
                input.focus().parent().parent().addClass("tableformhover");
            }

            input = th.parent().parent().next().find("[name*='form['],a.deleterow,a.addrow").first();
            if (keyCode == 39 && input.length > 0) {
                currentinput = input;
                $(".tableformhover").removeClass("tableformhover");
                input.focus().parent().parent().addClass("tableformhover");
            }
            input = th.parent().parent().prev().find("[name*='form['],a.deleterow,a.addrow").first();
            if (keyCode == 37 && input.length > 0) {
                currentinput = input;
                $(".tableformhover").removeClass("tableformhover");

                input.focus().parent().parent().addClass("tableformhover");
            }
            if (currentinput && currentinput.length > 0) {
                focusinput(currentinput);
            } 
            lastkeydown++;
            var lastkeydowninternal = lastkeydown;
            setTimeout(function () {
                if (lastkeydowninternal == lastkeydown) {
                    triggeredkeydown = false;
                }
            }, 1000);
        }
    }

    $('body').on("click", "[data-jltableform] > div > div", function (e) {
        if (e.originalEvent) {
            var focusedelement = $(':focus');
            if (focusedelement.length == 0 || e.type == "click") {
                if (!triggeredkeydown) {
                $(".tableformhover").removeClass("tableformhover");
                $(this).addClass("tableformhover");
               
                }
            }
        }
    });

    var ekeydownpressed = false;
    var ekeydowncount = 0;
    $('body').on("keydown", "[data-jltableform] [name]", function (e) {
        if (e.keyCode >= 37 && e.keyCode <= 40 && e.ctrlKey) {
            e.preventDefault();
            ekeydownpressed = true;
            keydownmovements(e.keyCode, $(this));
            ekeydowncount++;
            var lastekeydownpressedinternal = ekeydowncount;
            setTimeout(function () {
                if (lastekeydownpressedinternal == ekeydowncount) {
                    ekeydownpressed = false;
                }
            }, 100);
        }
    });
    $(document).on("keydown", function (e) {
        if (e.keyCode >= 37 && e.keyCode <= 40 && e.ctrlKey && ekeydownpressed==false) {

            var cinput = $(".tableformhover:first").find("[name]");
            keydownmovements(e.keyCode, cinput);
        }
    });
    
    $('body').on("afterappendcomplete", "[data-jltableform]", function (e, data) {
        if (e.target == e.currentTarget) {
            $(this).jltableform();
            $(window).trigger("resize");
             
            
        }
        
    });
    function setresponsivetable() {

    }

    $(window).on("resize", function (e) {
        $(".divtable.formtable").each(function () {
            $(this).removeClass("bytwo responsivetable fullwidthinputs");
            if ($(this).width() > $(this).parent().width()) {
                $(this).addClass("responsivetable");
                if ($(this).width() > 600) {
                    $(this).addClass("bytwo");
                }
                if ($(this).width() <= 300) {
                    $(this).addClass("fullwidthinputs");
                }
            }

        });
    });
    $(window).trigger("resize");

});