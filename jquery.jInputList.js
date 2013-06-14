/**
 * jInputList
 * @author - Danny Callaghan danny@dannycallaghan.com www.dannycallaghan.com
 * Version: 0.1
 * MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
 */


;(function ( $, window, document, undefined ) {
    
    var pluginName  =   'jInputList',
        defaults    =   {
            onRemoveItem : null,
            onAddItem : null,
            onAutoPopulateList : null
        };

    function Plugin( element, options ) {
        this.element    =   element;
        this.options    =   $.extend( {}, defaults, options) ;
        this._defaults  =   defaults;
        this._name      =   pluginName;
        this.init();
    }

    Plugin.prototype.init = function () {
        var _this   =   $( this.element ),
            o       =   this.options;

        o.hiddenInput = _this.find( 'input[type=hidden]' );

        _this.find( 'input' ).bind( 'keyup keydown', function ( e ) {
            handleKeyPress( e, _this, 'up', o );
        } );

        _this.bind( 'click', function ( e ) {
            $( this ).find( 'input[type=text]' ).focus();
        } );

        _this.find( 'input[type=text]' ).bind( 'blur', function ( e ) {
            handleComplete( e, _this, o );
        } );

        if ( o.hiddenInput.val().length ) {
            populateList( o.hiddenInput.val(), _this, o );
        }

    }

    populateList = function ( val, obj, o ) {
        var values = val.split(',');
        for ( var x = 0, i = values.length; x < i; x = x + 1 ) {
            addToList( $.trim( values[ x ] ), obj, false, o );
        }
        if ( o.onAutoPopulateList ) {
            o.onAutoPopulateList( obj );
        }
    }

    addToList = function ( text, obj, add_to_input, o ) {
        var ul = obj.find( 'ul' );
        if ( text.length === 0 ){ return; }
        if ( ul.children( '#_' + text.toLowerCase() ).length !== 0 ) {
            ul.find( 'input[type=text]' ).val( '' );
            return;
        }
        var choice = $( '<li>' )
                        .addClass( 'choice' )
                        .attr( 'id', '_' + text.toLowerCase() )
                        .append( 
                            $( '<span>' ).text( text )
                        )
                        .append(
                            $( '<i>' ).text( 'x' ).bind( 'click', function ( e ) {
                                removeItem( $( this ).parents( 'li' ), obj, o );
                            } )
                        );
        choice.insertBefore( ul.children().last() );
        ul.find( 'input').val('').css( 'width', 26 );
        if ( add_to_input === true ) {
            addToInput( text, obj, o );
        }
    }

    addToInput = function ( val, obj, o ) {
        var input = obj.find( 'input[type=hidden]' );
        if ( input.val().length ) {
            input.val( input.val() + ',' + val );
        } else {
            input.val( val );
        }
        if ( o.onAddItem ) {
            o.onAddItem( obj );
        }
    }

    removeItem = function ( el, obj, o ) {
        var input = obj.find( 'input[type=hidden]' ),
            val = input.val(),
            text = el.children( 'span' ).text(),
            aVal = val.split( ',' ),
            newStr;
        if ( aVal.length === 1 ) {
            newStr = '';newStr;
        } else {
            for ( var i = 0, x = aVal.length; i < x; i = i + 1 ) {
                if ( aVal[ i ] === text ) {
                    aVal.splice( i, 1 );
                }
            }
            newStr = aVal.join(',');
        }
        input.val( newStr );
        el.remove();
        if ( o.onRemoveItem ) {
            o.onRemoveItem( obj );
        }
    }

    handleKeyPress = function ( e, obj, type, o ) {
        var code = e.keyCode ? e.keyCode : e.which,
            target = $( e.target ),
            ul = target.parents( 'ul' );
        if ( code === 8 && target.val().length === 0 ) {
            if ( e.type === 'keyup' ) {
                var prev = target.parent().prev();
                if ( prev.length ) {
                    if ( prev.hasClass( 'can-delete' ) ) {
                        removeItem( prev, obj, o );
                    } else {
                        prev.addClass( 'can-delete' );
                    }
                }
            }
        } else {
            ul.find( 'li.can-delete' ).removeClass( 'can-delete' );
            if ( code === 13 ) {
                e.preventDefault();
                if ( e.type === 'keyup' ) {
                    addToList( target.val(), obj, true, o );
                }
            } else {
                adjustInputLength( $( e.target ) );
            }
        }
    }

    handleComplete = function ( e, obj, o ) {
        var input = obj.find( 'input[type="text"]' ).val();
        if ( input.length !== 0 ) {
            addToList( input, obj, true, o );
        }
    }

    adjustInputLength = function ( el ) {
        var diff = 25,
            width = measureThis( el.val() ),
            total = diff + width;
        if ( total > 26 ) {
            el.css( {
                'width' : total
            } );
        }
    }

    measureThis = function ( val ) {
        var m = $( '#jinputlist-dest' ),
            el = $( '<span>').text( val ),
            width;
        m.append( el );
        width = el.width();
        m.empty();
        return width;
    }

    $.fn[ pluginName ] = function ( options ) {
        return this.each( function () {
            if ( !$.data( this, 'plugin_' + pluginName ) ) {
                $.data( this, 'plugin_' + pluginName,
                new Plugin( this, options ) );
            }
        });
    }
  
})( jQuery, window, document );
