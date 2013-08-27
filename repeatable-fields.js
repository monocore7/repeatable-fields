/*
 * jQuery Repeatable Fields v0.1
 * http://www.rhyzz.com/repeatable-fields/
 *
 * Copyright (c) 2013 Rhyzz
 * License GPL
*/
(function($) {
	$.fn.repeatable_fields = function(custom_settings) {
		var default_settings = {
			wrapper: '.wrapper',
			container: '.container',
			row: '.row',
			cell: '.cell',
			add: '.add',
			remove: '.remove',
			move: '.move',
			template: '.template',
			is_sortable: true,
			before_add: null,
			after_add: after_add,
			before_remove: null,
			after_remove: null,
		}

		var settings = $.extend(default_settings, custom_settings);

		// Initialize all repeatable field wrappers

		initialize(this);

		function initialize(parent) {
			$(settings.wrapper, parent).each(function(index, element) {
				wrapper = this;

				var container = $(wrapper).children(settings.container);

				$(wrapper).on('click', settings.add, function(event) {
					event.stopImmediatePropagation();

					var row_template = $(container).children(settings.template).html();

					if($(container).children(settings.template).attr('type') == 'application/json') {
						var row_template = JSON.parse(row_template);
					}

					if(typeof settings.before_add === 'function') {
						settings.before_add(container);
					}

					var new_row = $(row_template).show().appendTo(container);

					if(typeof settings.after_add === 'function') {
						settings.after_add(container, new_row);
					}

					// The new row might have it's own repeatable field wrappers so initialize them too

					initialize(new_row);
				});

				$(wrapper).on('click', settings.remove, function(event) {
					event.stopImmediatePropagation();

					var row = $(this).parents(settings.row).first();

					if(typeof settings.before_remove === 'function') {
						settings.before_remove(container, row);
					}

					row.remove();

					if(typeof settings.after_remove === 'function') {
						settings.after_remove(container);
					}
				});

				if(settings.is_sortable == true && $.ui.sortable !== undefined) {
					$(wrapper).find(settings.container).sortable({
						handle: settings.move,
						row: $(settings.row, '>'),
						helper: function(element, ui) {
							ui.children().each(function() {
								jQuery(this).width(jQuery(this).width());
							});
	
							return ui;
						},
					});
				}
			});
		}

		/*
			TODO:
			This function doesn't take into consideration multiple references to {{row-count-placeholder}}'s so this might not work with nested
			repeatable field wrappers
		*/

		function after_add(container, new_row) {
			var row_count = $(container).children(settings.row).length;

			$('> ' + settings.cell + ' > *', new_row).each(function() {
				$.each(this.attributes, function(index, element) {
					this.value = this.value.replace(/{{row-count-placeholder}}/, row_count - 1);
				});
			});
		}
	}
})(jQuery);