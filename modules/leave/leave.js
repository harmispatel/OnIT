var FORM_STATE = RECORD_INDEX = BALANCE_LEAVE = 0;
var btn_view_days, btn_add_leave, leave_data, leave_days;
var holidays = holiday_description = [];
var LEAVE_ID = NOOFDAYS = FILE_UPLOAD_PATH = '';
var HOLIDAYS;

MC_LEAVE_ID = '26';
EM_LEAVE_ID = '273';
TIME_OFF_ID = '261';

$.fn.data_table_features = function (table_id)
{
    try
    {
        if (!$.fn.dataTable.isDataTable(`#${ table_id }`))
        {
            table = $(`#${ table_id }`).DataTable
                ({
                    "searching": false,
                    "paging": false,
                    "info": false,
                    "order": [[1, "desc"]]
                });
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.data_table_destroy = function (table_id)
{
    try
    {
        if ($.fn.dataTable.isDataTable(`#${ table_id }`))
        {
            $(`#${ table_id }`).DataTable().destroy();
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.reset_form = function (form)
{
    try
    {
        if (form == 'form')
        {
            LEAVE_ID = '';
            NOOFDAYS = '';
            BALANCE_LEAVE = 0;
            $('#start_date').val('');
            $('#end_date').val('');
            $('#dd_leave_type').val('').change();
            $('#txt_reason').val('');
            $('#chk_allow_weekend').prop('checked', false);

            $('.form-group').each(function ()
            {
                $(this).removeClass('has-error');
            });

            $('.help-block').each(function ()
            {
                $(this).remove();
            });

            $('#leave_file,.leave_file_cost').hide();
            $('#leave_days_info').hide();
            leave_data = [];
            leave_days = 0.0;

            $('#txt_cost').val(0);
            $('#txt_gst').val(0);
            $('#txt_roundup').val(0);
            $('#txt_total').val(0);
            $('#dd_expenses').val('').change();
            $("#btn_upload").show();

            $.fn.reset_upload_form();
        }
        if (form == 'remark_list_form')
        {
            $('#le_remark').val('');
            $('#tbl_remark_list tbody').html('');
        }
        if (form == 'leave_days')
        {
            leave_data = [];
            $('#chk_all').prop('checked', false);
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.get_leave_details = function ()
{
    try
    {
        let data =
        {
            em_type_id: EM_LEAVE_ID,
            user_id: SESSIONS_DATA.id,
            client_id: SESSIONS_DATA.client_id,
            year: new Date().getFullYear()
        };

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_leave_details', data),
                function (return_data)
                {
                    if (return_data)
                    {

                        $.fn.populate_leave_details(return_data.data);
                        $.fn.data_table_features('tbl_summary_list');
                    }
                }, false, false, '', false
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_leave_details = function (data)
{
    try
    {
        var row = '';
        if (data)
        {

            for (var i = 0; i < data.length; i++) 
            {

                var entitle_leave = (data[i].entitle_leave) ? data[i].entitle_leave : 0;
                var brought_forward = (data[i].brought_forward) ? data[i].brought_forward : 0;
                var type_id = (data[i].type_id) ? data[i].type_id : null;
                var leave_type = (data[i].leave_type) ? data[i].leave_type : null;
                if (type_id == TIME_OFF_ID)
                {
                    entitle_leave = (parseFloat(entitle_leave) * 8);
                    brought_forward = (parseFloat(brought_forward) * 8);
                }
                var paid_leave_taken = (data[i].paid_leave_taken) ? data[i].paid_leave_taken : 0;
                var unpaid_leave_taken = (data[i].unpaid_leave_taken) ? data[i].unpaid_leave_taken : 0;
                var em_paid_leave_taken = (data[i].em_paid_leave_taken) ? data[i].em_paid_leave_taken : 0;
                let emergency_leave = (data[i].emergency_leave) ? data[i].emergency_leave : 0; // added on 22 Nov 2019 by Jamal

                if (type_id == AN_LEAVE_ID)
                {
                    var available_leave = (parseFloat(entitle_leave) + parseFloat(brought_forward)) - (parseFloat(paid_leave_taken) + parseFloat(em_paid_leave_taken) + parseFloat(emergency_leave));
                }
                else
                {
                    var available_leave = (parseFloat(entitle_leave) + parseFloat(brought_forward)) - (parseFloat(paid_leave_taken));
                }

                let type_id_str = (type_id == TIME_OFF_ID) ? 'Hours' : 'Days';
                row += `<tr>
                            <td>${ leave_type } <small>(${ type_id_str })</small></td>
                            <td>${ parseFloat(entitle_leave).toFixed(1) }</td>
                            <td>${ parseFloat(brought_forward).toFixed(1) }</td>
                            <td>${ parseFloat(paid_leave_taken).toFixed(1) }</td>
                            <td>${ parseFloat(unpaid_leave_taken).toFixed(1) }</td>
                            <td>${ parseFloat(available_leave).toFixed(1) }</td>
                            </tr>`;
            }
            $('#tbl_summary_list > tbody').append(row);
        }

    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.get_holidays = function ()
{
    try
    {
        let year = moment($('#start_date').val()).year();

        if ($('#end_date').val() != '')
        {
            year = moment($('#start_date').val()).year() + ',' + moment($('#end_date').val()).year();
        }

        let data =
        {
            year: year,
            user_id: SESSIONS_DATA.id,
            client_id: SESSIONS_DATA.client_id
        };

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_leave_public_holidays', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        let data = return_data.data;
                        HOLIDAYS = return_data.data;
                        for (var i = 0; i < data.length; i++)
                        {
                            holidays.push(data[i].holiday);
                            holiday_description.push(data[i].holiday_desc);
                        }
                    }
                }, true, false, false
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.save_edit_form = function ()
{
    try
    {
        let leave_type = $('#dd_leave_type option:selected').attr('data');
        if (leave_type)
        {
            leave_type = $.fn.get_json_string(decode($('#dd_leave_type option:selected').attr('data')));
        }

        if ((leave_type) && leave_type.descr_code == "timeoff")
        {
            leave_data = [];
            let leave_param = {};
            let start_part = $('#start_date').val().split('-');
            leave_param.leave_date = start_part[2] + '-' + start_part[1] + '-' + start_part[0];
            leave_param.no_of_days = $('#dd_leave_time_off').val();
            leave_param.half_day_opt = 0;
            leave_data.push(leave_param);
            leave_days = $('#dd_leave_time_off').val();
        }

        if (leave_data && leave_data.length == 0)
        {
            $.fn.show_right_error_noty('Please select at least one leave');
            btn_add_leave.stop();
        }
        else
        {
            let reason = $('#txt_reason').val();
            let filename = $('#hidden_filename').val();

            let data =
            {
                id: LEAVE_ID,
                leave_data: leave_data,
                no_of_days: leave_days,
                type_id: $('#dd_leave_type').val(),
                type_name: $('#dd_leave_type option:selected').text(),
                reason: reason,
                user_id: SESSIONS_DATA.id,
                client_id: SESSIONS_DATA.client_id,
                emp_name: SESSIONS_DATA.name
            };


            if ((leave_type) && leave_type.descr_code == "medical_leave")
            {
                data.cost = $('#txt_cost').val();
                data.gst = $('#txt_gst').val();
                data.roundup = $('#txt_roundup').val();
                data.total = $('#txt_total').val();
                data.noe = $('#dd_expenses').val();
            }

            $.fn.write_data
                (
                    $.fn.generate_parameter('add_edit_leave', data),
                    function (return_data)
                    {
                        if (return_data.data)
                        {
                            let data = return_data.data;
                            LEAVE_ID = data.id;
                            var files_total = $('#files_cert .file-upload.new').length + $('#files .file-upload.new').length;
                            FILES_TOTAL = 0;
                            if (files_total > 0)
                            {
                                $.fn.upload_medical_certificate();
                                $.fn.upload_medical_bill();
                            }
                            else
                            {
                                $.fn.populate_on_success();
                                btn_add_leave.stop();
                            }

                        }

                    }, false, false
                );

            return true;
        }
    }
    catch (err)
    {
        // console.log(err);
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.upload_medical_certificate = function ()
{
    try
    {
        if ($('#files_cert .file-upload.new').length > 0)
        {
            FILE_UPLOAD_PATH = `../files/${ SESSIONS_DATA.client_id }/${ MODULE_ACCESS.module_id }/${ LEAVE_ID }/`;

            let attachment_data =
            {
                id: '',
                primary_id: LEAVE_ID,
                secondary_id: '',
                module_id: MODULE_ACCESS.module_id,
                type_id: 0,
                filename: '',
                filesize: "0",
                json_field: {},
                user_id: SESSIONS_DATA.id,
                client_id: SESSIONS_DATA.client_id
            };

            $.fn.upload_file('files_cert', attachment_data, function (total_files, total_success, filename, attach_return_data)
            {
                if (total_files == total_success)
                {
                    $.fn.populate_on_success();
                }
            }, false);
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.upload_medical_bill = function ()
{
    try
    {
        if ($('#files .file-upload.new').length > 0)
        {
            FILE_UPLOAD_PATH = `../files/${ SESSIONS_DATA.client_id }/${ MODULE_ACCESS.module_id }/${ LEAVE_ID }/`;

            let attachment_data =
            {
                id: '',
                primary_id: LEAVE_ID,
                secondary_id: '',
                module_id: MODULE_ACCESS.module_id,
                type_id: 1,
                filename: '',
                filesize: "0",
                json_field: {},
                user_id: SESSIONS_DATA.id,
                client_id: SESSIONS_DATA.client_id

            };

            $.fn.upload_file('files', attachment_data, function (total_files, total_success, filename, attach_return_data)
            {
                // FILES_TOTAL++;
                if (total_files == total_success)
                {
                    $.fn.populate_on_success();
                }
            }, false);
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_on_success = function ()
{
    try
    {
        $.fn.show_right_success_noty('Data has been recorded successfully');
        $.fn.reset_form('form');

        $.fn.get_list(false);
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_list_form = function (data, is_scroll)
{
    try
    {
        if (data) 
        {
            if (is_scroll == false)
            {
                $('#tbl_list > tbody').empty();
            }

            var row = '';
            var data_val = '';
            for (var i = 0; i < data.length; i++)
            {
                data_val = encode(JSON.stringify(data[i]));
                let start_date = (data[i].start_date) ? moment(data[i].start_date).format('DD-MMM-YYYY') : '';
                let end_date = (data[i].end_date) ? moment(data[i].end_date).format('DD-MMM-YYYY') : '';
                let applied_date = (data[i].created_date) ? moment(data[i].created_date).format('DD-MMM-YYYY') : '';

                //let viewcount = data[i].viewed.count;
                let viewcount = (data[i].remark_count) ? data[i].remark_count : 0;
                let viewed = '';

                viewed = `<span class="badge bg-danger rounded-circle noti-icon-badge viewed_${ data[i].id }" style="z-index: 1;position: absolute;">${ viewcount }</span>`;

                var half_day_opt = '';
                var type = (data[i].type) ? data[i].type : '';
                var no_of_days = (data[i].no_of_days) ? data[i].no_of_days : 0;
                var type_id = (data[i].type_id) ? data[i].type_id : '';
                var TIME_OFF_ID_str = (type_id == TIME_OFF_ID) ? ' + Hour(s)' : '';
                var reason = (data[i].reason) ? data[i].reason : '';
                var sum_approved = (data[i].sum_approved) ? data[i].sum_approved : 0;
                var sum_rejected = (data[i].sum_rejected) ? data[i].sum_rejected : 0;

                if (no_of_days == '0.5') 
                {
                    if (data[i].half_day_opt == '1') 
                    {
                        half_day_opt = '+ (First Half)';
                    }
                    if (data[i].half_day_opt == '2') 
                    {
                        half_day_opt = '+ (Second Half)';
                    }
                }

                row = '';
                row = `<tr><td width="1%">`;
                if (data[i].verified == 0)
                {
                    row += `<a href="javascript:void(0)" class="tooltips delete btn btn-xs btn-danger waves-effect waves-light"  data-id="${ data[i].id }" onclick="$.fn.delete_form(decode($(this).attr(\'data-value\')))" data-trigger="hover" title="Delete Leave" data-value="${ data_val }">
                    <i class="fas fa-trash-alt" aria-hidden="true" title="Delete Data"></i>
                  </a>`;
                }
                row += `</td><td width="12%">${ start_date }</td>
                    <td width="12%">${ end_date }</td>
                    <td width="12%">${ applied_date }</td>
                    <td  width="5%">${ type } ${ half_day_opt }</td>
                    <td width="5%">${ no_of_days } ${ TIME_OFF_ID_str }</td>
                    <td  width="5%">${ reason }</td>`;

                if (data[i].verified == 0)
                {
                    row += `<td  width="5%"><span class="badge bg-soft-warning text-warning">Pending Verification</span></td>`;
                }
                else
                {
                    row += `<td  width="5%">`;
                    if (sum_approved > 0)
                    {
                        row += `<i class="fas fa-check-square badge bg-soft-success text-success">${ sum_approved } Approved</i>`;
                    }
                    else if (sum_rejected > 0)
                    {
                        row += `<br /><i class="fa fa-minus-square badge bg-soft-danger text-danger">${ sum_rejected } Rejected</i>`;
                    }
                    else
                    {
                        row += `<span class="badge bg-soft-warning text-warning">Pending Approval</span>`;
                    }
                    row += `</td>`;
                }

                row += `<td width="10%"><div id="leave_file_${ data[i].id }"></div></td>`;
                if (viewcount == 0)
                {
                    row += `<td><a class="btn btn-primary btn-xs waves-effect waves-light" data-toggle="tooltip" data-placement="left" title="View Remarks" href="javascript:void(0)" data-value='${ data_val }' onclick="$.fn.view_remark(decode($(this).attr('data-value')))"><i class="fas fa-external-link-alt"></i></a></td></tr>`;
                } else
                {
                    row += `<td>${ viewed }<a class="btn btn-primary btn-xs waves-effect waves-light" data-toggle="tooltip" data-placement="left" title="View Remarks" href="javascript:void(0)" data-value='${ data_val }' onclick="$.fn.view_remark(decode($(this).attr('data-value')))"><i class="fas fa-external-link-alt"></i></a></td></tr>`;

                }

                $('#tbl_list tbody').append(row);

                if (type_id == MC_LEAVE_ID)
                {
                    var attachment = (data[i].attachment) ? data[i].attachment : null;
                    if (attachment)
                    {

                        for (let j = 0; j < attachment.length; j++)
                        {

                            attachment[j]['name'] = (attachment[j]['filename']) ? attachment[j]['filename'] : null;
                            attachment[j]['uuid'] = (attachment[j]['id']) ? attachment[j]['id'] : null;
                            attachment[j]['deleteFileParams'] = (attachment[j]) ? JSON.stringify(attachment[j]) : null;

                            if (attachment[j]['filename'])
                                delete attachment[j]['filename'];

                            if (attachment[j]['id'])
                                delete attachment[j]['id'];
                        }
                    }

                    $.fn.populate_fileupload(data[i], `leave_file_${ data[i].id }`);
                    $("#tbl_list").find(`#leave_file_${ data[i].id } .col-sm-4`).toggleClass('col-sm-4 col-sm-12');
                }

            }
            $('#div_load_more').show();
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_remark_list = function (data)
{
    try
    {
        if (data)
        {
            var row = '';
            var data_val = '';

            for (var i = 0; i < data.length; i++)
            {
                data_val = encode(JSON.stringify(data[i]));

                row += '<tr>' +
                    '<td>' + data[i].created_date + '(' + data[i].created_by + ') - ' + data[i].leave_remarks + '</td>';

                row += '</tr>';

            }
            $('#tbl_remark_list tbody').html(row);
        }

    } catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.delete_form = function (data)
{
    try
    {
        data = JSON.parse(data);
        if (data.id == '')
        {
            $.fn.show_right_error_noty('ID cannot be empty');
            return;
        }

        var data =
        {
            id: data.id,
            start_date: data.start_date,
            end_date: data.end_date,
            no_of_days: data.no_of_days,
            reason: data.reason,
            user_id: SESSIONS_DATA.id,
            client_id: SESSIONS_DATA.client_id,
            doc_no: data.doc_no
        };

        bootbox.confirm
            ({
                title: "Delete Confirmation",
                message: "Please confirm before you delete.",
                buttons:
                {
                    cancel:
                    {
                        label: '<i class="fa fa-times"></i> Cancel'
                    },
                    confirm:
                    {
                        label: '<i class="fa fa-check"></i> Confirm'
                    }
                },
                callback: function (result)
                {

                    if (result == true)
                    {
                        $.fn.write_data
                            (
                                $.fn.generate_parameter('delete_leave_details', data),
                                function (return_data)
                                {
                                    if (return_data)
                                    {
                                        RECORD_INDEX = 0;
                                        $('#tbl_list > tbody').empty();
                                        $.fn.populate_list_form(return_data.data.list, false);
                                        $.fn.show_right_success_noty('Data has been deleted successfully');
                                    }

                                }, false
                            );
                    }
                }
            });

    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.check_nature_of_expense = function (obj)
{
    let data = $('#' + obj + ' option:selected').attr('data');
    if (data)
    {
        data = $.fn.get_json_string(decode($('#' + obj + ' option:selected').attr('data')));
    }
    if (data)
    {
        if (data.descr_code == "medical_claims")
        {
            $('.leave_file_cost').show();
        }
        else
        {
            $('.leave_file_cost').hide();
        }
    }
};

$.fn.change_balance_leave = function (action)
{
    // console.log(action);
    var day_option = [];
    var all_leave_days = 0.0;
    var count = 0;
    $('#tbl_days input[name="chk_full"]').each(function () 
    {
        if ($(this).is(':checked'))
        {
            day_option.push(1.0);
            all_leave_days = parseFloat(all_leave_days) + 1.0;
            $("#half_option_" + $(this).attr('data-value') + "").hide();
            $("#half_" + $(this).attr('data-value') + "").hide();

        }
        if (!$(this).is(':checked'))
        {

            day_option.push(0.5);
            all_leave_days = parseFloat(all_leave_days) + 0.5;
            $("#half_option_" + $(this).attr('data-value') + "").show();
            $("#half_" + $(this).attr('data-value') + "").show();
        }

        count++;
    });

    var half_day_opt = [];
    $('#tbl_days input[name="chk_half_opt"]').each(function () 
    {
        if ($(this).is(':checked'))
        {
            half_day_opt.push(1);
        }
        if (!$(this).is(':checked'))
        {
            half_day_opt.push(2);
        }
    });

    var count = 0;
    leave_days = 0.0;
    leave_data = [];
    $('#tbl_days input[name="chk_day"]').each(function () 
    {
        var leave_param = {};
        if (action == 'one')
        {
            if ($(this).is(':checked'))
            {
                leave_days = parseFloat(leave_days) + parseFloat(day_option[count]);
                leave_param.leave_date = $(this).val();
                leave_param.no_of_days = day_option[count];
                leave_param.half_day_opt = leave_param.no_of_days == '0.5' ? half_day_opt[count] : 0;
                leave_data.push(leave_param);
            }
        }
        if (action == 'all')
        {
            if ($('#chk_all').is(':checked'))
            {
                leave_days = parseFloat(leave_days) + parseFloat(day_option[count]);
                leave_param.leave_date = $(this).val();
                leave_param.no_of_days = day_option[count];
                leave_param.half_day_opt = leave_param.no_of_days == '0.5' ? half_day_opt[count] : 0;
                leave_data.push(leave_param);
            }
        }
        count++;
    });

    var balance_leave = parseFloat(BALANCE_LEAVE) - parseFloat(leave_days);
    $('#div_balance_leave').html(balance_leave.toFixed(1));
};

$.fn.set_validation_form = function ()
{
    $('#leave_form').parsley(
        {
            classHandler: function (parsleyField)
            {
                return parsleyField.$element.closest(".errorContainer");
            },
            errorsContainer: function (parsleyField)
            {
                return parsleyField.$element.closest(".errorContainer");
            },
        }
    );


}

$.fn.view_file_status = function (obj)
{
    let data = $('#' + obj + ' option:selected').attr('data');
    if (data)
    {
        data = $.fn.get_json_string(decode($('#' + obj + ' option:selected').attr('data')));
    }
    if (data)
    {
        if (data.descr_code == "medical_leave")
        {
            $('#leave_file').show();
            $('#leave_time_off,#btn_save_time_off').hide();
            $('#leave_end_date,#btn_view_days,#leave_days_check').show();
        }
        else if (data.descr_code == "timeoff")
        {
            $('#leave_time_off,#btn_save_time_off').show();
            $('#leave_end_date,#btn_view_days,#leave_days_check').hide();
        }
        else
        {
            $('#leave_file,.leave_file_cost').hide();
            $('#leave_time_off,#btn_save_time_off').hide();
            $('#leave_end_date,#btn_view_days,#leave_days_check').show();
        }
    }
};

$.fn.view_days = function ()
{
    try
    {

        $.fn.reset_form('leave_days');
        $('#tbl_days > tbody').empty();

        if ($('#leave_form').parsley().validate() == false)
        {
            btn_view_days.stop();
            return;
        }
        else
        {
            $.fn.get_holidays();
            var start_part = $('#start_date').val().split('-');
            var end_part = $('#end_date').val().split('-');
            var start_date = start_part[2] + '-' + start_part[1] + '-' + start_part[0];
            var end_date = end_part[2] + '-' + end_part[1] + '-' + end_part[0];

            var start = new Date(start_date);
            var end = new Date(end_date);
            var allow_weekend = $('#chk_allow_weekend').is(':checked');
            var allow_holiday = $('#chk_allow_holiday').is(':checked');

            var row = '';

            if (end >= start)
            {
                var no_of_days = ((end - start) + 86400000) / 86400000;
                var curr_date = new Date(start_date);
                var count = 0;
                var holiday_str = '';
                for (var i = 0; no_of_days > i; i++)
                {
                    var temp_date = moment(curr_date).format(SERVER_DATE_FORMAT);
                    var holiday_status = false;
                    let date_arr = HOLIDAYS.filter(data => data.holiday == temp_date);
                    if (date_arr.length > 0)
                    {
                        holiday_status = true;
                        holiday_str += `<h5><span class="text-info"><b>${ moment(curr_date).format(UI_DATE_FORMAT) } - ${ date_arr[0].holiday_desc } </b></span></h5>`;
                    }
                    var day_name = moment(curr_date).format('dddd');
                    var view_row = true;
                    if (!allow_weekend && (day_name.trim() == 'Saturday' || day_name.trim() == 'Sunday'))
                    {
                        view_row = false;
                    }
                    else if (!allow_holiday && holiday_status)
                    {
                        view_row = false;
                    }
                    else
                    {
                        view_row = true;

                        var txt_class = '';
                        if (day_name.trim() == 'Saturday' || day_name.trim() == 'Sunday')
                        {
                            txt_class = 'text-primary';
                        }
                        if (holiday_status)
                        {
                            txt_class = 'text-danger';
                        }
                    }
                    var curr_date_str = (curr_date) ? moment(curr_date).format(SERVER_DATE_FORMAT) : '';
                    var curr_date_value = (curr_date) ? moment(curr_date).format(UI_DATE_FORMAT) : '';
                    if (view_row)
                    {
                        row += `<tr class="${ txt_class }">`;
                        row += `<td width="10%" class="chkday"><input type="checkbox" class="form-check-input" name="chk_day" value="${ curr_date_str }" onchange="$.fn.change_balance_leave('one')"></td>`;
                        row += `<td width="25%">${ curr_date_value }</td>`;
                        row += `<td width="25%">${ day_name }</td>`;
                        row += `<td><label class="toggle"><div class="form-check form-switch checkfull"><input type="checkbox" id="chk_full_${ i }" data-value="${ i }" name="chk_full"  class="form-check-input" data-color="#99d683"  checked onchange="$.fn.change_balance_leave('one')"><span class="slider"></span><span class="labels" data-on="FULL" data-off="HALF"></span></div></label></td>`;
                        row += `<td><label class="toggle" id="half_${ i }" data-value='${ i }' style="display: none;"><div class="form-check form-switch checkfull" id="half_option_${ i }" data-value="${ i }" style="display: none;" class="form-check form-switch checkhalf"><input type="checkbox" id="chk_half_opt_${ i }" name="chk_half_opt" class="form-check-input" data-toggle="toggle" checked onchange="$.fn.change_balance_leave('one')"><span class="slider"></span><span class="labels" data-on="FIRST" data-off="SECOND"></span></div></label></td>`;
                        row += `</tr>`;


                    }
                    curr_date = moment(curr_date).add(1, 'days');
                    count++;
                }

                $('#tbl_days tbody').append(row);
                if (holiday_str == '')
                {
                    $('#div_holidays').html(`<h5><span class="text-info"><b>No public holidays in selected date range.</b></span></h5>`);
                }
                else
                {
                    $('#div_holidays').html(holiday_str);
                }

                $.fn.avaliable_leave_info();
            }
            else
            {
                $.fn.show_right_error_noty('Start date is more than or equal with end date');
            }

            btn_view_days.stop();
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.view_remark = function (data)
{
    try
    {
        var data = JSON.parse(data);

        $('#tbl_remark_list_user tbody').html('');
        $('.viewed_' + data.id).hide();
        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_leave_remark', { leave_id: data.id, remarklist: 1, user_id: SESSIONS_DATA.id, client_id: SESSIONS_DATA.client_id }),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        let thisData = return_data.data;
                        $.fn.populate_remark_list_form(thisData);
                    }
                }, false, false, false, false
            );

        LEAVE_ID = data.id;
        $('#remarkListModal').modal('show');
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.add_edit_remark = function ()
{
    try
    {
        var remark = $('#le_remark').val();
        var action = '';

        if (remark != '')
        {
            var data =
            {
                leave_id: LEAVE_ID,
                leave_remarks: remark,
                action: action,
                user_id: SESSIONS_DATA.id,
                emp_name: SESSIONS_DATA.name,
                client_id: SESSIONS_DATA.client_id
            };

            $.fn.write_data
                (
                    $.fn.generate_parameter('leave_add_edit_remark', data),
                    function (return_data)
                    {
                        if (return_data.data)
                        {
                            let thisData = return_data.data;
                            $.fn.reset_form('remark_list_form');
                            $.fn.populate_remark_list_form(thisData);
                        }

                    }, false, btn_save_remarks

                );
        }
        else
        {
            btn_save_remarks.stop();
            return;
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_remark_list_form = function (data)
{
    try
    {
        if (data) 
        {
            let row = '';
            var viewed = '';
            for (let i = 0; i < data.length; i++)
            {
                let data_val = encode(JSON.stringify(data[i]));
                viewed = (data[i].read_by != 1 && data[i].created_by != SESSIONS_DATA.id) ? `<h5 style="float:left;padding:3px;" class="m-0"><span class="badge bg-warning">New</span></h5>` : ``;
                row += `<tr><td>
				<ul class="panel-comments" style="list-style: none;">
				<li id="${ data[i].id }">                     					
                    <span class="commented">
                    <a class="btn btn-xs btn-danger waves-effect waves-light" data-toggle="tooltip" data-placement="left" href="javascript:void(0)" data-value='${ data_val }' onclick="$.fn.delete_remark_form(decode($(this).attr('data-value')))" data-trigger="hover" data-original-title="Delete data "><i class="fas fa-trash-alt"></i></a>
                    &nbsp;&nbsp; <b>${ data[i].created_by_name }</b> - <a href="javascript:void(0)">${ data[i].created_date }</a><br/>
                    </span>
                    <span style="margin-left:45px;">${ data[i].leave_remarks }</span>
                    <div style="width:25%;float:right;text-align:right;">
                    ${ viewed }
                    </div>
				</li>
				</ul>
                </td></tr>`;
            }
            $('#tbl_remark_list tbody').html(row);
        }
        else
        {
            $('#tbl_remark_list > tbody').empty();
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.delete_remark_form = function (data)
{
    try
    {
        data = JSON.parse(data);

        if (data.id == '')
        {
            $.fn.show_right_error_noty('Remark ID cannot be empty');
            return;
        }

        let param =
        {
            id: data.id,
            leave_id: data.leave_id,
            user_id: SESSIONS_DATA.id,
            client_id: SESSIONS_DATA.client_id
        };

        $.fn.write_data
            (
                $.fn.generate_parameter('leave_delete_remark', param),
                function (return_data)
                {
                    if (return_data)
                    {
                        $.fn.reset_form('remark_list_form');
                        $.fn.populate_remark_list_form(return_data.data);
                    }

                }, false
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.avaliable_leave_info = function ()
{
    try
    {
        if ($('#dd_leave_type').val() != '')
        {
            let data =
            {
                type_id: $('#dd_leave_type').val(),
                user_id: SESSIONS_DATA.id,
                client_id: SESSIONS_DATA.client_id
            };

            $.fn.fetch_data
                (
                    $.fn.generate_parameter('get_balance_leave', data),
                    function (return_data)
                    {
                        if (return_data)
                        {
                            let data = return_data.data;
                            let available_no_of_days = 0;
                            let available_brought_forward = 0;
                            let already_applied_days = 0;
                            let current_applied_days = 0;

                            available_no_of_days = (data.leave_entitle && data.leave_entitle[0].no_of_days) ? data.leave_entitle[0].no_of_days : available_no_of_days;

                            available_brought_forward = (data.leave_entitle && data.leave_entitle[0].brought_forward) ? data.leave_entitle[0].brought_forward : available_brought_forward;

                            already_applied_days = (data.leave_applied && data.leave_applied.applied_days) ? data.leave_applied.applied_days : already_applied_days;

                            current_applied_days = (NOOFDAYS != '') ? NOOFDAYS : current_applied_days;

                            let balance_leave = (parseFloat(available_no_of_days) + parseFloat(available_brought_forward)) - (parseFloat(already_applied_days) + parseFloat(current_applied_days));

                            $('#div_available_leave').html(balance_leave.toFixed(1));
                            $('#div_balance_leave').html(balance_leave.toFixed(1));

                            BALANCE_LEAVE = balance_leave;

                            $('#leave_days_info').show();
                        }
                    }, false, false, '', false
                );
        }
        else
        {
            $('#div_available_leave').html('n/a');
            $('#div_balance_leave').html('n/a');
        }

    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.get_list = function (is_scroll)
{
    try
    {
        let data =
        {
            start_index: RECORD_INDEX,
            limit: LIST_PAGE_LIMIT,
            user_id: SESSIONS_DATA.id,
            client_id: SESSIONS_DATA.client_id
        };

        if (is_scroll)
        {
            data.start_index = RECORD_INDEX;
        }
        $.fn.fetch_data(

            $.fn.generate_parameter('get_leave_list', data),
            function (return_data)
            {
                if (return_data.data)
                {
                    let data = return_data.data;
                    if (data.rec_index)
                    {
                        RECORD_INDEX = data.rec_index;
                        $('#btn_load_more').show();
                    }
                    else
                    {
                        $('#btn_load_more').hide();
                    }
                    if (data)
                    {
                        $.fn.data_table_destroy('tbl_list');
                        $.fn.populate_list_form(data, is_scroll);
                        $.fn.data_table_features('tbl_list');

                    }
                    else if (return_data.code == 1 || len == 0)
                    {
                        if (!is_scroll)
                        {
                            $('#btn_load_more').hide();
                            $.fn.data_table_destroy('tbl_list');
                            $('#tbl_list tbody').empty().append
                                (
                                    `<tr>
                                        <td colspan="12" style='text-align:center;'>
                                            <div class="list-placeholder">No records found!</div>
                                        </td>
                                    </tr>`
                                );
                        }
                        else if (is_scroll)
                        {
                            $('#btn_load_more').hide();
                            $.fn.show_right_success_noty('No more records to be loaded');
                        }
                    }
                }
            }, false, false, '', false
        );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.select_all_checkbox = function (status)
{
    try
    {
        $('.chkday input[name="chk_day"]').each(function () 
        {
            if (status == true)
            {
                this.checked = true;
            }
            else
            {
                this.checked = false;
            }
        });
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.init_upload_file = function ()
{

    $.fn.reset_upload_form();

    $.fn.intialize_fileupload('fileupload', 'files');
    $.fn.intialize_fileupload('fileupload_cert', 'files_cert');
};

$.fn.reset_upload_form = function ()
{
    $('#files,#files_cert').html('');
};

$.fn.get_leave_dropdown_data = function ()
{
    try
    {
        let data =
        {
            user_id: SESSIONS_DATA.id,
            client_id: SESSIONS_DATA.client_id,
            descr_code: "leave_type,nature_of_expenses",
            type: "masterlist",
            key: "S3RqblBGb1RETnVIMVptaWwxRmQxMVVUdUtRemFTTjgzVUQzTktLZEhHMD0="
        };

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_master_dropdown_list', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        let data = return_data.data;
                        $.fn.populate_dd_values('dd_leave_type', data.filter(leave_type => leave_type.master_category_code == "leave_type"));
                        $.fn.populate_dd_values('dd_expenses', data.filter(nature_expenses => nature_expenses.master_category_code == "nature_of_expenses"));
                    }
                }, true
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_dd_values = function (element_id, dd_data, is_search = false)
{
    try
    {
        $('#' + element_id).empty();
        $('#' + element_id).append(`<option value="">Please Select</option>`);

        if (dd_data)
        {
            for (let item of dd_data)
            {
                $('#' + element_id).append(`<option value="${ item.id }" data="${ encode(JSON.stringify(item)) }">${ item.descr } </option>`);
            }
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.bind_command_events = function ()
{
    try
    {
        $('#btn_add_leave,#btn_save_time_off').click(function (e)
        {
            e.preventDefault();
            RECORD_INDEX = 0;
            btn_add_leave = Ladda.create(this);
            btn_add_leave.start();
            $.fn.save_edit_form();

        });

        $('#btn_view_days').click(function (e)
        {
            e.preventDefault();
            btn_view_days = Ladda.create(this);
            btn_view_days.start();
            $.fn.view_days();
        });

        $('#chk_all').change(function (e)
        {
            e.preventDefault();
            $.fn.select_all_checkbox($(this).is(':checked'));
        });

        $('#btn_load_more').click(function (e)
        {
            e.preventDefault();
            $.fn.get_list(true);
        });

        $('#txt_cost, #txt_gst, #txt_roundup').on('change', function (e) 
        {
            e.preventDefault();
            let txt_cost = $('#txt_cost').val();
            let txt_gst = $('#txt_gst').val();
            let txt_roundup = $('#txt_roundup').val();

            $('#txt_total').val(parseFloat(txt_cost) + parseFloat(txt_gst) + parseFloat(txt_roundup));
        });

        $('#btn_add_remark').click(function (e)
        {
            e.preventDefault();
            btn_save_remarks = Ladda.create(this);
            btn_save_remarks.start();
            $.fn.add_edit_remark();
        });

        $.fn.init_upload_file();

    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.prepare_form = function ()
{
    try
    {
        $.fn.reset_form('form');
        $('#leave_form').parsley
            ({
                successClass: 'has-success',
                errorClass: 'has-error',
                errors:
                {
                    classHandler: function (el)
                    {
                        return $(el).closest('.form-group');
                    },
                    errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
                    errorElem: '<li></li>'
                }
            });

        $("#start_date").flatpickr({
            altInput: true,
            altFormat: "d-m-Y",
            dateFormat: "d-m-Y",
            enableTime: false,
        });
        $("#end_date").flatpickr({
            altInput: true,
            altFormat: "d-m-Y",
            dateFormat: "d-m-Y",
            enableTime: false,
        });

        $.fn.get_leave_dropdown_data();
        if (SESSIONS_DATA.is_admin != 1)
        { $.fn.get_leave_details(); }
        if (SESSIONS_DATA.is_admin == 1)
        { $('#totalleave').hide(); }

        $.fn.get_list(false);
        $.fn.set_validation_form();
        $('#public-holiday').attr("href", `https://www.onestopmalaysia.com/public-holidays-${ new Date().getFullYear() }.html`);
        $('.populate').select2();


    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.form_load = function ()
{
    try
    {
        $.fn.prepare_form();
        $.fn.bind_command_events();
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$(document).ready(function ()
{
    $.fn.form_load();
});