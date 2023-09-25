CURRENT_PATH	= '../../';

$.fn.data_table_features = function()
{	
	try
	{	
		if (!$.fn.dataTable.isDataTable('#tbl_asset_dashboard'))
        {
            table = $('#tbl_asset_dashboard').DataTable({
                "searching": false,
                "paging": false,
                "info": false,
                "order": []
            });
        }
		if (!$.fn.dataTable.isDataTable('#tbl_asset_dashboard_detail'))
        {
            table = $('#tbl_asset_dashboard_detail').DataTable({
                "searching": false,
                "paging": false,
                "info": false,
                "order": []
            });
        }
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.data_table_destroy = function()
{
	try
	{
		if ($.fn.dataTable.isDataTable('#tbl_asset_dashboard'))
        {
            $('#tbl_asset_dashboard').DataTable().destroy();
        }
		if ($.fn.dataTable.isDataTable('#tbl_asset_dashboard_detail'))
        {
            $('#tbl_asset_dashboard_detail').DataTable().destroy();
        }
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.got_to_task = function (task_no)
{
    try 
    {	
    	
    	if(task_no != '')
    	{
    		window.open("task/my-task?task_no=" + task_no + "&method=details", '_blank');
    	}
    }
    catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.get_list = async function()
{
	try
	{
		let company_id = SESSIONS_DATA.company_id;
  		let emp_id = SESSIONS_DATA.emp_id;
		
		let myDate = new Date(); 
		var myDates = new Date(myDate);
		myDates.setDate(myDates.getDate() + 30);
		let end_date = Math.round(myDates.getTime()/1000.0);
		var datas =
		{
			filter_val: '1,2,3,4',
			emp_id: emp_id,
			company_id:company_id,
			start: '1500550716',
			end:end_date
		};
	
		let event_value_arr = [];
		$.fn.write_data
		( 
			$.fn.generate_parameter('get_admin_events','', datas),
			function (return_data){
				if (return_data.data){
						for(var i = 0, l = return_data.data.length; i < l; i++) {
							let event_value = {};
							event_value['id'] = return_data.data[i].id;
							event_value['title'] = return_data.data[i].title;
							event_value['start'] = return_data.data[i].start;
							if(return_data.data[i].start != return_data.data[i].end){
								var end = new Date(return_data.data[i].end);
								end.setDate(end.getDate());
							}
							else{
								end = return_data.data[i].end;
							}
							event_value['end'] = end;
							event_value['type'] = return_data.data[i].type;
							if(return_data.data[i].type == "holiday"){
								className='bg-success';
							}
							else if(return_data.data[i].type == "task"){
								className='bg-info';
							}
							else if(return_data.data[i].type == "leave"){
								className='bg-danger';
							}
							else if(return_data.data[i].type == "appointment"){
								className='bg-warning';
							}
							else{
								className='bg-primary';
							}
							event_value['className'] = className;
							
							event_value_arr.push(event_value);
						}
				} 
				$.fn.load_calender_fun(event_value_arr);
				
			},false
		);
		

		
	}
	catch(err)
	{   
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.populate_alluser_detail = function(emp_id)
{
	try
	{
	 	$.fn.fetch_data(
			$.fn.generate_parameter('populate_dashboard_all_user_detail', {emp_id 	: emp_id}),
			function(return_data)
			{
				if(return_data)
				{
					$('#tbl_list > tbody').empty();
					let data 	= return_data.data;
					let row		= '';
					row 		+= `<tr class="textcenter">${data[0].name}</tr>`;
					for(let i = 0; i < data.length; i++)
					{
						var res = data[i].page.split(".");
						row +=`<tr class="">
									<td>${res[0]}</td>
									<td>${data[i].duration}</td>
								</tr>`;
					}
					row += `<tr class="texthead">
								<td>Total Duration</td>
	                            <td>${data[0]['totalduration']}</td>
                            </tr>`;
					
					$('#tbl_list tbody').append(row);
					$('#demo').hide();
					$('#userdata').show();
				}

			},true
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_appointment_list = function()
{
	try
	{
		var data	=
		{
			emp_id 			: SESSIONS_DATA.emp_id
	 	};

	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_appt_dashboard_list', data),
			function(return_data)
			{
				if(return_data)
				{
					$('#tbl_appt_dashboard > tbody').empty();
					let data 	= return_data.data;
					let row		= '';
					for(let i = 0; i < data.length; i++)
					{
						data_val = escape(JSON.stringify(data[i])); 
						row += `<tr></td><td>${data[i].name}</td>`;
						
						if(data[i].appt_follow_up > 0)
						{
							data[i].appt_follow_up = `<span class="label label-primary">${data[i].appt_follow_up}</span>`;
						}
						if(data[i].appt_took_place > 0)
						{
							data[i].appt_took_place = `<span class="label label-success">${data[i].appt_took_place}</span>`;
						}
						if(data[i].appt_postponed > 0)
						{
							data[i].appt_postponed = `<span class="label label-warning">${data[i].appt_postponed}</span>`;
						}
						if(data[i].appt_cancelled > 0)
						{
							data[i].appt_cancelled = `<span class="label label-danger">${data[i].appt_cancelled}</span>`;
						}
									
						row +=`<td>${data[i].appt_total}</td>
									<td>${data[i].appt_open}</td>
									<td>${data[i].appt_follow_up}</td>
									<td>${data[i].appt_took_place}</td>
									<td>${data[i].appt_postponed}</td>
									<td>${data[i].appt_cancelled}</td>
								</tr>`;
					}
					$('#tbl_appt_dashboard tbody').append(row);
				}

			},true
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_assets_list = function()
{
	try
	{
		let data	=
		{
			emp_id 	: SESSIONS_DATA.emp_id
	 	};
		$.fn.fetch_data(
			$.fn.generate_parameter('get_assets_dashboard_list', data),
			function(return_data)
			{	
				$.fn.data_table_destroy();
				if(return_data)
				{
					$('#tbl_asset_dashboard > tbody').empty();
					let data 	= return_data.data.list;
					let row		= '';
					for(let i = 0; i < data.length; i++)
					{
						data_val = escape(JSON.stringify(data[i])); 
						row += `<tr>
									<td>${data[i].descr}</td>
									<td>${data[i].asset_count}</td>
									<td data-sort="${data[i].asset_val}">RM ${data[i].asset_val}</td>
								</tr>`;

					}
					$('#tbl_asset_dashboard tbody').append(row);
					
					
					$('#tbl_asset_dashboard_detail > tbody').empty();
					let data1 	= return_data.data.detail;
					let row1	= '';
					for(let i = 0; i < data1.length; i++)
					{
						row1 += `<tr>
									<td>${data1[i].assigned_to}</td>
									<td>${data1[i].type_name}</td>
									<td>${data1[i].brand_name}</td>
									<td>${data1[i].client_name != null ? data1[i].client_name : '-'}</td>
									<td>${data1[i].expiry_date != null ? moment(data1[i].expiry_date).format('D-MMM-YYYY') : '-'}</td>
								</tr>`;
					}
					$('#tbl_asset_dashboard_detail tbody').append(row1);
					
				}
				$.fn.data_table_features();
			},true
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_leave_list = function()
{
	try
	{
		let data	=
		{
			emp_id 	: SESSIONS_DATA.emp_id
	 	};

	 	$.fn.fetch_data(
			$.fn.generate_parameter('get_leave_dashboard_list', data),
			function(return_data)
			{
				if(return_data)
				{
					$('#tbl_leave_dashboard > tbody').empty();
					let data 	= return_data.data;
					let row		= '';
					for(let i = 0; i < data.length; i++)
					{
						data_val = escape(JSON.stringify(data[i]));
						
						row += `<tr>
									<td>${data[i].name}</td>
									<td>${data[i].annual_leave}  BF: ( ${data[i].brought_forward} ) / ${data[i].annual_taken}</td>
									<td>${data[i].med_leave} /  ${data[i].med_taken}</td>
									<td>${data[i].emergency_taken}</td>
									<td>${(parseFloat(data[i].annual_taken) + parseFloat(data[i].emergency_taken))}</td>
									<td>${
											(    ( parseFloat(data[i].annual_leave) + parseFloat(data[i].brought_forward) ) - 
												 ( parseFloat(data[i].annual_taken) + parseFloat(data[i].emergency_taken) )
										     )
										 }</td>
									<td>${data[i].unpaid_taken}</td>
								</tr>`;
					}
					$('#tbl_leave_dashboard tbody').append(row);
				}

			},true
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_data_admin_dashboard = function()
{
    try
    {  
		let lead_access = $.fn.get_accessibility(191); 
		let emp_id = SESSIONS_DATA.emp_id;
        let data    =
        {   
            emp_id   : emp_id,
            view_all : MODULE_ACCESS.viewall,
            lead_access_view_all : lead_access.viewall,
            lead_access_view     : lead_access.view
        };
    
        $.fn.fetch_data
        ( 
            $.fn.generate_parameter('get_data_admin_dashboard', data),
            function(return_data)
            {
                if (return_data.code == 0)
                { 
					$("#total_open_app_count_id").text(return_data.data.app_count);
					$("#pending_claim_count_id").text(return_data.data.doc_count);
                    $("#total_assests_count_id").text(return_data.data.asset_count);
                    $("#leave_pending_app_count_id").text(return_data.data.leave_count);
					$("#topusers_id").text(return_data.data.topusers);

					if(return_data.data.mosttopusers){
						let most_top_duration = return_data.data.mosttopusers.duration ? return_data.data.mosttopusers.duration : '0:00';
						if(emp_id == return_data.data.mosttopusers.id)
                        { 
							$("#mosttopusers_id").text("You are the top user"); 
                        }
                        else 
                        { 
							$("#mosttopusers_id").text(most_top_duration+" "+"(Top hours)"); 
                        } 
					}
                }
            },true
        );
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.get_data_admin_dashboard_details = function()
{
    try
    {  
		let lead_access = $.fn.get_accessibility(191); 
		let emp_id = SESSIONS_DATA.emp_id;
        let data    =
        {   
            emp_id   : emp_id,
            view_all : MODULE_ACCESS.viewall,
            lead_access_view_all : lead_access.viewall,
            lead_access_view     : lead_access.view
        };
    
        $.fn.fetch_data
        ( 
            $.fn.generate_parameter('get_data_admin_dashboard_details', data),
            function(return_data)
            {
                if (return_data.code == 0)
                { 
					$('#tbl_list_demo > tbody').empty();
					let total_duration = return_data.data.total_duration;
					let allusersdetails = return_data.data.allusersdetails;

					let row		= '';
					for(let i = 0; i < allusersdetails.length; i++)
					{
						row +=`<tr class='textcenter'>
								<td><a id="${allusersdetails[i].id}" href='javascript:void(0);' onclick='$.fn.populate_alluser_detail(${allusersdetails[i].id});'>${allusersdetails[i].username}
								</a></td><td class="text-center">${allusersdetails[i].duration}</td>
								</tr>`;
					}
					row +=`<tr class=""><td><b>Total Duration</b></td><td class="text-center"><b>${total_duration}</b></td></tr>`;
					$('#tbl_list_demo').append(row);
                }
            },true
        );
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.prepare_form = function()
{
	try
	{
		$.fn.get_data_admin_dashboard();
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.bind_command_events = function()
{
	try
	{
		$('#btn_close_app_details').click(function()
		{
			$('#div_appointment_details').hide();
		});
		$('#btn_close_asset_detail').click(function()
		{
			$('#div_asset_details').hide();
		});
		$('#btn_close_asset_exp_detail').click(function()
		{
			$('#div_asset_details_expiry').hide();
		});
		$('#btn_close_leave_details').click(function()
		{
			$('#div_leave_details').hide();
		});
		$('#btn_close').click(function()
		{
			$('#userdata').hide();
		});
		$('#btn_close_details').click(function()
		{
			$('#demo').hide();
		});
		
		$('#top_user_data_check').click(function(e)
		{
			e.preventDefault();
			$('#demo').show();
			$('#userdata').hide();
			let emp_id = SESSIONS_DATA.emp_id;
			$.fn.get_data_admin_dashboard_details(emp_id);
		});

		$('#btn_appointment_more').click( function(e)
		{
			e.preventDefault();
			$('#div_asset_details')			.hide();
			$('#div_asset_details_expiry')	.hide();
			$('#div_appointment_details')	.show();
			$.fn.get_appointment_list();
		});
		$('#btn_asset_more').click( function(e)
		{
			e.preventDefault();
			$('#div_appointment_details')	.hide();
			$('#div_asset_details')			.show();
			$('#div_asset_details_expiry')	.show();
			$.fn.get_assets_list();
		});
		
		$('#btn_leave_more').click( function(e)
		{
			e.preventDefault();
			$('#div_appointment_details')	.hide();
			$('#div_asset_details')			.hide();
			$('#div_asset_details_expiry')	.hide();
			$('#div_leave_details')			.show();
			$.fn.get_leave_list();
		});

		$('.close-detail').click(function() 
	    {
	        $(this).parents('.view-detail').fadeOut('slow');
	    });
		$('input[name="appointment_filter[]"]').change(function(event) 
		{
		    if ($(this).attr('id') == 'selectall') 
		    {
		      $('input[type=checkbox]').not(this).prop('checked', this.checked);
		    }

		    if ($(this).attr('id') != 'selectall') 
		    {
		      if (!$(this).is(':checked'))
		      {
		        $('#selectall').prop('checked', false);
		      }
		    }

			$('#calendar').fullCalendar('destroy');
		    $.fn.get_list();
		});
		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.form_load = async function()
{
	try
	{   
	    await $.fn.prepare_form();
	    $.fn.bind_command_events();
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.load_calender_fun = function(event_arr){
	!function(l) {
		"use strict";
		function e() {
			this.$body = l("body"), this.$modal = l("#event-modal"), this.$calendar = l("#calendar"), 
			this.$formEvent = l("#form-event"), this.$btnNewEvent = l("#btn-new-event"), this.$btnDeleteEvent = l("#btn-delete-event"), 
			this.$btnSaveEvent = l("#btn-save-event"), this.$modalTitle = l("#modal-title"), 
			this.$calendarObj = null, this.$selectedEvent = null, this.$newEventData = null;
		}
		e.prototype.onEventClick = function(e) {
			this.$formEvent[0].reset(), this.$formEvent.removeClass("was-validated"), this.$newEventData = null, 
			this.$selectedEvent = e.event, l("#event-title").val(this.$selectedEvent.title), 
			l("#event-category").val(this.$selectedEvent.classNames[0]);
			console.log(this.$selectedEvent.extendedProps.type);
			let leavetype = this.$selectedEvent.extendedProps.type;
			try 
		      {
		      	if (leavetype == 'task') 
			    {
			    	let due_date = moment(this.$selectedEvent._instance.range.start).format('YYYY-MM-DD');
			    	$.fn.fetch_data
			        (
						$.fn.generate_parameter('get_tasks_for_dashboard', {
							due_date: due_date,
							is_admin: SESSIONS_DATA.is_admin,
							emp_id 	: SESSIONS_DATA.emp_id, 
					   }),
					   function(return_data) 
				        {
							$('#display_tasks table > tbody').empty();
							if (return_data.data.length > 0)
    						{	let row	 = '';
								let data = '';
    							data 	= return_data.data;
								for(var i = 0; i < data.length; i++)
        						{
									row += `<tr>
					                    <td>${data[i].task_no}</td>
					                    <td>${data[i].title}</td>
					                    <td>${data[i].task_type_desc}</td>
					                    <td>${data[i].task_priority_desc}</td>
					                    <td>
											<!--<a href="javascript:void(0);" onclick="$.fn.got_to_task('${data[i].task_no}')"><i class="fas fa-sign-in-alt"></i></a>-->
											<button type="button" class="btn btn-success btn-xs waves-effect waves-light" data-bs-toggle="tooltip"  onclick="$.fn.got_to_task('${data[i].task_no}')"">
												<i class="fas fa-sign-in-alt"></i>
											</button>
					                    </td>
				                    </tr>`;
								}
    							$('#display_tasks table > tbody').append(row);
    						}
    						$('#display_tasks').modal('show');
						}
					);
			    }
				else if(leavetype != 'holiday')
			    {
					$.fn.fetch_data
			        (
			            $.fn.generate_parameter('get_user_event_detail', {id: this.$selectedEvent._def.publicId, type: leavetype }),
			            function(return_data) 
			            {   
				            let data = return_data.data;
				            for (let propName in data) 
				            {
				              if (propName == 'people_name') 
				              {
				                $('#display-' + propName).html(data[propName].split(',').join('\n'));
				              } 
				              else
				              {
				                $('#display-' + propName).html(data[propName]);
				              }
				            }

				            if (leavetype == 'appointment') 
				            {
				              $('#display_appointment').modal('show');
				            } 
				            else if (leavetype == 'leave') 
				            {
				              $('#display_leave').modal('show');
				            }
			            }
			        );
				}
			  }
		      catch (err) 
		      {
		        $.fn.log_error(arguments.callee.caller, err.message);
		      }

		}, e.prototype.init = function() {
			this.$modal = new bootstrap.Modal(document.getElementById("event-modal"), {
				keyboard: !1
			});
			var e = new Date(l.now());
			new FullCalendar.Draggable(document.getElementById("external-events"), {
				itemSelector: ".external-event",
				eventData: function(e) {
					return {
						title: e.innerText,
						className: l(e).data("class")
					};
				}
			});

			var t = event_arr;
			var a = this;
			
			a.$calendarObj = new FullCalendar.Calendar(a.$calendar[0], {
				slotDuration: "00:15:00",
				slotMinTime: "08:00:00",
				slotMaxTime: "19:00:00",
				themeSystem: "bootstrap",
				bootstrapFontAwesome: !1,
				buttonText: {
					today: "Today",
					month: "Month",
					week: "Week",
					day: "Day",
					list: "List",
					prev: "Prev",
					next: "Next"
				},
				initialView: "dayGridMonth",
				contentHeight:"auto",
				handleWindowResize: !0,
				height: l(window).height() - 200,
				headerToolbar: {
					left: "prev,next today",
					center: "title",
					right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
				},
				initialEvents: t,
				editable: !0,
				droppable: !0,
				selectable: !0,
				dateClick: function(e) {
					a.onSelect(e);
				},
				eventClick: function(e) {
					a.onEventClick(e);
				}
			}), a.$calendarObj.render(), a.$btnNewEvent.on("click", function(e) {
				a.onSelect({
					date: new Date(),
					allDay: !0
				});
			}), a.$formEvent.on("submit", function(e) {
				e.preventDefault();
				var t = a.$formEvent[0];
				if (t.checkValidity()) {
					if (a.$selectedEvent) a.$selectedEvent.setProp("title", l("#event-title").val()), 
					a.$selectedEvent.setProp("classNames", [ l("#event-category").val() ]); else {
						var n = {
							title: l("#event-title").val(),
							start: a.$newEventData.date,
							allDay: a.$newEventData.allDay,
							className: l("#event-category").val()
						};
						a.$calendarObj.addEvent(n);
					}
					a.$modal.hide();
				} else e.stopPropagation(), t.classList.add("was-validated");
			}), l(a.$btnDeleteEvent.on("click", function(e) {
				a.$selectedEvent && (a.$selectedEvent.remove(), a.$selectedEvent = null, a.$modal.hide());
			}));
		}, l.CalendarApp = new e(), l.CalendarApp.Constructor = e;
	}(window.jQuery), function() {
		"use strict";
		window.jQuery.CalendarApp.init();
	}();
}

$(document).ready(function()
{	
	$.fn.get_list();
	$.fn.form_load();
});