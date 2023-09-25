var RECORD_INDEX = 0;
var LIMIT = 10;
var btn_save, btn_contact_save, btn_comm_save, btn_assign_contact, btn_save_principal;
CURRENT_PATH = '../../';
var FILE_UPLOAD_PATH = '';
var client_id = '';

$.fn.data_table_features = function (table_id)
{
    try
    {
        if (!$.fn.dataTable.isDataTable('#' + table_id))
        {
            table = $('#' + table_id).DataTable
                ({
                    "searching": false,
                    "paging": false,
                    "info": false,
                    "order": [[0, "asc"]]
                });
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.contact_form = function (form_status, reset_form)
{
    $.fn.reset_form('modal');
    $('#new_contact_div').slideDown();
};

$.fn.data_table_destroy = function (table_id)
{
    try
    {
        if ($.fn.dataTable.isDataTable('#' + table_id))
        {
            $('#' + table_id).DataTable().destroy();
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.delete_additional = function (obj)
{
    try
    {
        let data = JSON.parse($(obj).attr('data'));
        data.is_active = 0;
        $(obj).attr('data', JSON.stringify(data));
        $(obj).closest('tr').hide('slow');
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_additional_list_form = function (data)
{
    try
    {
        if (data)
        {
            $("#tbl_additional tbody").find("tr:not('#base_row')").remove();

            let row = '';
            let data_val = '';
            for (var i = 0; i < data.length; i++)
            {
                data_val = JSON.stringify(data[i]);

                row += `<tr><td>${ data[i].additional_type }</td>
                            <td>${ decodeURIComponent(data[i].value) }</td>
                            <td>
                                <button type="button" class="btn btn-danger rotate-45 btn_add_additional" onClick="$.fn.delete_additional(this);" data='${ data_val }'>
                                <i class="fa fa-minus fa-fw" aria-hidden="true"></i>
                                </button>
                            </td>
                        </tr>`;
            }
            $('#base_row').before(row);
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.remove_additional = function (el)
{
    $(el).closest('tr').remove();
}

$.fn.add_additional = function ()
{
    try
    {
        let data = JSON.stringify({ "id": "", "additional_id": $('#dd_additional').val(), "value": encodeURIComponent($('#txt_value').val()), "is_active": 1 });

        let btnAddAdditionalAction = (el) =>
        {
            $(el).closest('tr').hide('slow', function ()
            {
                $(el).closest('tr').remove();
            });
        }

        let row = `<tr>
                        <td>${ $('#dd_additional option:selected').text() }</td> 
                        <td>${ $('#txt_value').val() }</td>
                        <td>
                            <button type="button" class="btn btn-danger rotate-45 btn_remove_additional" onClick="$.fn.remove_additional(this)">
                                <i class="fa fa-times fa-fw" aria-hidden="true"></i>
                            </button>
                            <button style="display:none;" type="button" class="btn btn-primary rotate-45 btn_add_additional" onClick="btnAddAdditionalAction(this)"
                                data=${ data }>
                                <i class="fa fa-plus fa-fw" aria-hidden="true"></i>
                            </button>
                            
                        </td>
                    </tr>`;

        $.fn.reset_form('additional_form');
        $('#base_row').before(row);
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.delete_principal_account = function (data, element_id)
{
    try
    {
        var data = JSON.parse(data);
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
                        let data_delete =
                        {
                            id: data.id,
                            user_id: SESSIONS_DATA.id,
                            client_id: SESSIONS_DATA.client_id
                        };
                        $.fn.write_data
                            (
                                $.fn.generate_parameter('delete_principal_account', data_delete),
                                function (return_data)
                                {
                                    if (return_data)
                                    {
                                        $(`#${ element_id }`).fadeOut();
                                        $.fn.show_right_success_noty('Data has been deleted successfully');
                                        $('#total_principal').html(parseInt($('#total_principal').html()) - 1);
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

$.fn.populate_principal_accounts = function (data)
{
    try
    {
        if (data)
        {
            $('#tbl_principal_list > tbody').empty();
            let row = '';
            let data_val = '';
            for (var i = 0; i < data.length; i++)
            {
                data_val = encode(JSON.stringify(data[i]));
                delete_row = '';
                if (MODULE_ACCESS.delete == 1)
                {
                    delete_row = '<a class="tooltips" data-toggle="tooltip" data-placement="left" title="Delete" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.delete_principal_account(decode($(this).attr(\'data-value\')), $(this).closest(\'tr\').prop(\'id\'))"><i class="fa fa-trash-o"/></a>';
                }
                row += `<tr id="TR_PRINCIPAL_ROW_${ i }">
                        <td>${ delete_row }</td>
                        <td>${ data[i].principal_acc }</td>
                        <td>${ data[i].offering }</td>
                        <td>${ data[i].acc_manager }</td>
                        </tr>
                        `;
            }

            $('#tbl_principal_list tbody').append(row);
            $('#total_principal').html(data.length);
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.get_principal_accounts = function ()
{
    try
    {
        let data =
        {
            customer_id: $('#txt_client_id').val(),
            client_id: SESSIONS_DATA.client_id
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_principal_accounts', data),
                function (return_data)
                {
                    if (return_data)
                    {
                        $.fn.data_table_destroy('tbl_principal_list');
                        $.fn.populate_principal_accounts(return_data.data);
                        $.fn.data_table_features('tbl_principal_list');
                    }
                }, false, false, false, true
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.add_edit_form_principal = function ()
{
    try
    {
        if ($('#principal_form').parsley('validate') == false)
        {
            btn_save_principal.stop();
            return;
        }

        let data =
        {
            // client_id: $('#txt_client_id').val(),
            customer_id: $('#txt_client_id').val(),
            offering_id: $('#dd_offerings_principal').val(),
            manager_id: $('#dd_managers_principal').val(),
            principal_acc_id: $('#dd_principal_accounts').val(),
            user_id: SESSIONS_DATA.id,
            client_id: SESSIONS_DATA.client_id
        };

        $.fn.write_data
            (
                $.fn.generate_parameter('assign_principal_account', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        $.fn.reset_form('principal_form');
                        $.fn.show_right_success_noty('Pricipal Account has been assigned successfully');
                        $.fn.get_principal_accounts();
                    }
                }, false, btn_save_principal
            );

    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.get_offerings_by_contacts = function (contact_id)
{
    try
    {
        let data =
        {
            contact_id: contact_id,
            client_id: SESSIONS_DATA.client_id
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_offerings_by_contacts', data),
                function (return_data)
                {
                    if (return_data)
                    {
                        $.fn.populate_dd_values('dd_offerings_principal', return_data.data);
                    }
                }, false, false, false, true
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.add_remove_delete = function ()
{
    var count = $("#additional_div .condition-row").length;
    if (count == 1)
    {
        $("#additional_div .condition-row:first .delete-condition").hide();
    }
    else
    {
        $("#additional_div .condition-row .delete-condition").show();
    }

};

$.fn.navigate_form = function (client_id)
{
    try
    {
        let data =
        {
            id: client_id,
            view_all: MODULE_ACCESS.viewall,
            start_index: 0,
            limit: 1,
            is_admin: SESSIONS_DATA.is_admin,
            user_id: SESSIONS_DATA.id,
            client_id: SESSIONS_DATA.client_id
        };

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_client_list', data),
                function (return_data)
                {
                    if (return_data.data.list)
                    {
                        $.fn.populate_detail_form(JSON.stringify(return_data.data.list[0]));
                    }
                }, true
            );
    }
    catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.get_client_drop_down_values = function ()
{
    try
    {
        let data =
        {
            user_id: SESSIONS_DATA.id,
            view_all: 0, // MODULE_ACCESS.viewall,
            client_id: SESSIONS_DATA.client_id
        };

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_client_drop_down_values', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        let dropdown = return_data.data.dropdown;
                        $.fn.populate_dd_values('dd_search_type', dropdown.filter(search_type => search_type.master_category_code == "customer_type"), true);
                        $.fn.populate_dd_values('dd_search_assigned_to', return_data.data.account_managers, MODULE_ACCESS.viewall);
                        $('#dd_search_assigned_to').val($("#dd_search_assigned_to option:first").val()).change();
                        $.fn.populate_dd_values('dd_search_offerings', dropdown.filter(offerings => offerings.master_category_code == "customer_offerings"), true);
                        $.fn.populate_dd_values('dd_search_status', dropdown.filter(status => status.master_category_code == "customer_status"), true);
                        $.fn.populate_dd_values('dd_search_source', dropdown.filter(source => source.master_category_code == "customer_source"), true);
                        $.fn.populate_dd_values('dd_type', dropdown.filter(type => type.master_category_code == "customer_type"));
                        $.fn.populate_dd_values('dd_industry', dropdown.filter(industry => industry.master_category_code == "client_industry"));
                        $.fn.populate_dd_values('dd_client_status', dropdown.filter(status => status.master_category_code == "customer_status"));
                        $.fn.populate_dd_values('dd_source', dropdown.filter(source => source.master_category_code == "customer_source"));
                        $.fn.populate_dd_values('dd_com_medium', dropdown.filter(medium => medium.master_category_code == "customer_communication_type"));
                        $.fn.populate_dd_values('dd_offerings', dropdown.filter(offerings => offerings.master_category_code == "customer_offerings"));
                        $.fn.populate_dd_values('dd_contact_status', dropdown.filter(contact_status => contact_status.master_category_code == "customer_contact_status"));
                        $.fn.populate_dd_values('dd_additional', dropdown.filter(lead_additional => lead_additional.master_category_code == "customer_additional_details"));

                        $.fn.populate_dd_values('dd_assign_client', return_data.data.assign_to);
                        $.fn.populate_dd_values('dd_assign_to', return_data.data.assign_to);

                        $.fn.populate_dd_values('dd_bank', dropdown.filter(bank => bank.master_category_code == "customer_banks"));
                        $.fn.populate_dd_values('dd_offerings_principal', dropdown.filter(offerings => offerings.master_category_code == "customer_offerings"));
                        $.fn.populate_dd_values('dd_search_comm_type', dropdown.filter(medium => medium.master_category_code == "customer_communication_type"), true);
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

        if (is_search)
        {
            $('#' + element_id).append(`<option value="">All</option>`);
        }
        else if (element_id != 'dd_search_assigned_to' && element_id != 'dd_assign_client' && element_id != 'dd_type' && element_id != 'dd_offerings')
        {
            $('#' + element_id).append(`<option value="">Please Select</option>`);
        }

        for (let item of dd_data)
        {
            $('#' + element_id).append(`<option value="${ item.id }">${ item.descr }</option>`);
        }
        $('#' + element_id).val('').change();
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_comm_list = function (data)
{
    try 
    {

        $('#div_comm').empty();
        if (data.length > 0)
        {
            for (i = 0; i < data.length; i++)
            {
                $.fn.populate_comment_row(data[i], true);
            }
        }
    }
    catch (err) 
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.get_comm_list = function ()
{
    try
    {
        $.fn.intialize_fileupload('fileupload_reply', 'files_reply');
        let data =
        {
            customer_id: $('#txt_client_id').val(),
            user_id: SESSIONS_DATA.id,
            view_all: MODULE_ACCESS.viewall,
            client_id: SESSIONS_DATA.client_id
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_comm_list', data),
                function (return_data)
                {
                    if (return_data.data && parseInt(return_data.code) == 0)
                    {
                        $.fn.populate_comm_list(return_data.data);
                        getInitials();
                    }
                }, false, '', true, showErrorMsg = false
            );
    }
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.add_edit_comm_form = function ()
{
    try
    {
        if ($('#txt_comm').val() == '')
        {
            $.fn.show_right_error_noty('Reply cannot be empty');
            btn_comm_save.stop();
            return;
        }


        $('#txt_comm').val($('#txt_comm').val().replace(/['"]/g, ''));

        let data =
        {
            customer_id: $('#txt_client_id').val(),
            descr: $('#txt_comm').val().replace(/(?:\r\n|\r|\n)/g, '<br/>'),
            contact_id: $('#dd_com_contact').val(),
            comm_type: $('#dd_com_medium').val(),
            user_id: SESSIONS_DATA.id,
            emp_name: SESSIONS_DATA.name,
            client_id: SESSIONS_DATA.client_id
        }

        $.fn.write_data
            (
                $.fn.generate_parameter('add_edit_client_comm', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                      const list_data = return_data.data;

                      for(const idx in list_data)
                      {
                        let client_id = $('#txt_client_id').val();
                        let comm_id = list_data[idx].id;
                        FILE_UPLOAD_PATH = `../files/clients/${ client_id }/`;

                        let attachment_data =
                        {
                            id: '',
                            primary_id: client_id,
                            secondary_id: comm_id,
                            module_id: MODULE_ACCESS.module_id,
                            filename: '',
                            filesize: "0",
                            json_field: {},
                            user_id: SESSIONS_DATA.id,
                            client_id: SESSIONS_DATA.client_id
                        };

                        if ($('#files_reply .file-upload.new').length > 0)
                        {
                            $.fn.populate_comment_row(list_data[idx], true);

                            $.fn.upload_file('files_reply', 'comm_id', comm_id,
                                attachment_data, function (total_files, total_success, filename, attach_return_data)
                            {
                                if (total_files == total_success)
                                {
                                    $('#txt_comm').val('');
                                    $.fn.populate_fileupload(attach_return_data, 'comment-' + comm_id, true);
                                }
                            }, false, btn_comm_save);
                        }
                        else
                        {
                            $('#txt_comm').val('');
                            btn_comm_save.stop();
                            $.fn.populate_comment_row(list_data[idx], true);
                        }
                        getInitials();
                      }
                      
                    }
                }, false, btn_comm_save
            );
    }
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.set_validation_form = function ()
{
    $('#detail_form').parsley().destroy();
    $("#detail_form").parsley({
        classHandler: function (parsleyField)
        {
            return parsleyField.$element.closest(".errorContainer");
        },
        errorsContainer: function (parsleyField)
        {
            return parsleyField.$element.closest(".errorContainer");
        },
    });
    $('#principal_form').parsley
        ({
            successClass: 'has-success',
            errorClass: 'has-error',
            errors:
            {
                classHandler: function (el)
                {
                    return $(el).closest('.error-container');
                },
                errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
                errorElem: '<li></li>'
            }
        });

};

$.fn.populate_detail_form = function (data)
{
    try
    {

        var data = JSON.parse(data);
        $.fn.show_hide_form('EDIT', true);
        $('#detail_form').parsley().destroy();
        $.fn.set_validation_form();
        $('#h4_primary_no').text('Customer ID : ' + data.id);

        $.fn.fetch_data
            (

                $.fn.generate_parameter('get_client_details',
                    {
                        id: data.id,
                        client_id: SESSIONS_DATA.client_id
                    }),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        let data = return_data.data.details;
                        let json_field = $.fn.get_json_string(data.json_field);
                        $('#txt_client_id').val(data.id);
                        $('#txt_client_name').val(data.name ?? data.short_name);
                        $('#dd_industry').val(data.industry).change();
                        $('#dd_source').val(data.source).change();
                        $('#dd_client_status').val(data.client_status_id).change();
                        $('#txt_client_remarks').val(data.remarks);
                        $('#txt_office_tel').val(data.office_tel);
                        $('#txt_website').val(data.website);
                        $('#txt_address').val(decodeURIComponent(data.address));

                        $('#dd_assign_client').val('');
                        if (data.assign_user_id)
                        {
                            $('#dd_assign_client').val(data.assign_user_id.split(",")).change();
                            $.fn.populate_dd_values('dd_managers_principal', return_data.data.prinicpal_acc_managers);
                        }
                        $.fn.populate_dd_values('dd_principal_accounts', return_data.data.prinicpal_accounts);

                        $('#dd_type').val('');
                        if (data.type_id)
                        {
                            $('#dd_type').val(data.type_id.split(",")).trigger("change");
                        }

                        if (json_field.id_no != undefined)
                        {
                            $('#txt_id_no').val(json_field.id_no);
                        }
                        else
                        {
                            $('#txt_id_no').val('');
                        }

                        if (json_field.bank != undefined)
                        {
                            $('#dd_bank').val(json_field.bank).change();
                        }
                        else
                        {
                            $('#dd_bank').val('').change();
                        }

                        if (json_field.acc_no != undefined)
                        {
                            $('#txt_acc_no').val(json_field.acc_no);
                        }
                        else
                        {
                            $('#txt_acc_no').val('');
                        }

                        $('#new_contact_div').hide();

                        $.fn.populate_additional_list_form(return_data.data.additional);

                        $.fn.get_contact_dropdown();
                        $.fn.get_contacts_list();
                        $.fn.get_comm_list();

                        $.fn.get_contacts_for_approval();
                        $.fn.get_documents_list();
                        $.fn.get_principal_accounts();
                    }
                }, true);
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
            date_from: $('#from_date').val(),
            date_to: $('#to_date').val(),
            customer_name: $('#txt_search_client_name').val(),
            assigned_to: $('#dd_search_assigned_to').val(),
            type_id: $('#dd_search_type').val(),
            comm_type_id: $('#dd_search_comm_type').val(),
            offering_id: $('#dd_search_offerings').val(),
            status_id: $('#dd_search_status').val(),
            source_id: $('#dd_search_source').val(),
            is_contacts: $('#chk_is_contacts').is(':checked') ? 1 : 0,
            is_date: $('#chk_is_date').is(':checked') ? 1 : 0,
            start_index: RECORD_INDEX,
            limit: LIST_PAGE_LIMIT,
            is_for_download: false,
            view_all: MODULE_ACCESS.viewall,
            user_id: SESSIONS_DATA.id,
            client_id: SESSIONS_DATA.client_id
        };

        if (is_scroll)
        {
            data.start_index = is_scroll;
        }
        else
        {
            data.start_index = 0;
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_client_list', data),
                function (return_data)
                {
                    let data = return_data.data;
                    if (data)
                    {
                        $.fn.populate_list_form(data, is_scroll);
                        $.fn.generate_pagination(data);
                    }
                }, true
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.generate_pagination = function (data)
{
    try
    {
        let TotalRecords = data.total_records;
        let PageNumber = data.rec_index / LIMIT;
        let PageSize = LIMIT;
        let TotalPages = Math.ceil(TotalRecords / PageSize);
        let ClassName = "page-link";
        let DisableClassName = "disabled";

        let ReturnValue = "";

        if (TotalRecords == 0)
        {
            $('#pagination_div').hide();
        }
        else
        {
            $('#pagination_div').show();
        }

        if (+PageNumber > 1)
        {
            if (+PageNumber == 2)
                ReturnValue = ReturnValue + "<li class='page-item'><a pn='" + (+PageNumber - 1) + "' class='" + ClassName + "'>Previous</a></li>   ";
            else
            {
                ReturnValue = ReturnValue + "<li class='page-item'><a pn='";
                ReturnValue = ReturnValue + (+PageNumber - 1) + "' class='" + ClassName + "'>Previous</a></li>   ";
            }
        }
        else
            ReturnValue = ReturnValue + "<li class='page-item'><a class='page-link " + DisableClassName + "'>Previous</a></li>   ";
        if ((+PageNumber - 3) > 1)
            ReturnValue = ReturnValue + "<li class='page-item'><a pn='1' class='" + ClassName + "'>1</a></li><li class='page-item'><a class='disabled " + ClassName + "'>.....</a></li>   ";
        for (var i = +PageNumber - 3; i <= +PageNumber; i++)
            if (i >= 1)
            {
                if (+PageNumber != i)
                {
                    ReturnValue = ReturnValue + "<li class='page-item'><a pn='";
                    ReturnValue = ReturnValue + i + "' class='" + ClassName + "'>" + i + "</a></li>";
                }
                else
                {
                    ReturnValue = ReturnValue + "<li class='page-item active'><a class='" + ClassName + "'>" + i + "</a></li>";
                }
            }
        for (var i = +PageNumber + 1; i <= +PageNumber + 3; i++)
            if (i <= TotalPages)
            {
                if (+PageNumber != i)
                {
                    ReturnValue = ReturnValue + "<li class='page-item'><a pn='";
                    ReturnValue = ReturnValue + i + "' class='" + ClassName + "'>" + i + "</a></li>";
                }
                else
                {
                    ReturnValue = ReturnValue + "<li class='page-item'><a class='" + ClassName + "' style='font-weight:bold;'>" + i + "</a></li>";
                }
            }
        if ((+PageNumber + 3) < TotalPages)
        {
            ReturnValue = ReturnValue + "<li class='page-item'><a class='disabled " + ClassName + "'>.....</a></li><li class='page-item'><a pn='";
            ReturnValue = ReturnValue + TotalPages + "' class='" + ClassName + "'>" + TotalPages + "</a></li>";
        }
        if (+PageNumber < TotalPages)
        {
            ReturnValue = ReturnValue + "<li class='page-item'><a pn='";
            ReturnValue = ReturnValue + (+PageNumber + 1) + "' class='" + ClassName + "'>Next</a></li>";
        }
        else
        {
            ReturnValue = ReturnValue + " <li class='page-item'><a class='page-link " + DisableClassName + "'>Next</a></li>";
        }

        $(`#pagination_div .pagination`).html(ReturnValue);
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.get_contact_dropdown = function ()
{
    try
    {
        let data =
        {
            customer_id: $('#txt_client_id').val(),
            user_id: SESSIONS_DATA.id,
            view_all: MODULE_ACCESS.viewall,
            client_id: SESSIONS_DATA.client_id
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_client_contacts', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        data = return_data.data;
                        $('#dd_com_contact').empty();
                        for (let i = 0; i < data.length; i++)
                        {
                            $('#dd_com_contact').append($('<option></option>').attr('value', data[i].id).text(data[i].contact_name));
                        }
                        $('#dd_com_contact option:eq(0)').prop('selected', true).change();
                    }
                }, false
            );
    }
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.delete_sh_contact = function (contact_id)
{
    try 
    {
        bootbox.confirm
            ({
                title: "Delete Confirmation",
                message: "Are you sure to delete this Contact?.",
                buttons:
                {
                    cancel:
                    {
                        label: '<i class="fa fa-times"></i> Cancel'
                    },
                    confirm:
                    {
                        label: '<i class="fa fa-check"></i> Yes'
                    }
                },
                callback: function (result)
                {
                    if (result == true)
                    {
                        let data =
                        {
                            contact_id: contact_id,
                            user_id: SESSIONS_DATA.id,
                            client_id: SESSIONS_DATA.client_id
                        };
                        $.fn.write_data
                            (
                                $.fn.generate_parameter('delete_sh_contact', data),
                                function (return_data)
                                {
                                    if (return_data.data)
                                    {
                                        $(`#cr-${ contact_id }`).fadeOut();
                                        $.unblockUI();
                                        $.fn.show_right_success_noty('Contact has been removed successfully');
                                    }
                                }, true, true
                            );
                    }
                }
            });
    }
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.delete_sh_record = function (id, index)
{
    try 
    {
        bootbox.confirm
            ({
                title: "Delete Confirmation",
                message: "Are you sure to delete this record?.",
                buttons:
                {
                    cancel:
                    {
                        label: '<i class="fa fa-times"></i> Cancel'
                    },
                    confirm:
                    {
                        label: '<i class="fa fa-check"></i> Yes'
                    }
                },
                callback: function (result)
                {
                    if (result == true)
                    {
                        let data =
                        {
                            id: id,
                            user_id: SESSIONS_DATA.id,
                            client_id: SESSIONS_DATA.client_id
                        };
                        $.fn.write_data
                            (
                                $.fn.generate_parameter('delete_sh_record', data),
                                function (return_data)
                                {
                                    if (return_data.data)
                                    {
                                        $(`#TR_ROW_${ index }`).fadeOut();
                                        $.unblockUI();
                                        $.fn.show_right_success_noty('Record has been removed successfully');
                                    }
                                }, true, false
                            );
                    }
                }
            });
    }
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.populate_contact_details = function (obj)
{
    // try 
    // {   
    $.fn.reset_form('modal');
    let data = JSON.parse(obj);
    let json_field = $.fn.get_json_string(data.json_field);
    if (json_field != false)
    {
        $('#txt_mobile_no').val(json_field.mobile_no);
        $('#dd_contact_status').val(json_field.contact_status).change();
        $('#dd_user_status').val(json_field.user_status).change();

        if (json_field.offerings)
        {
            $('#dd_offerings').val(json_field.offerings.split(",")).change();
        }
    }

    if (json_field.additional_values)
    {
        if (json_field.additional_values.length > 0)
        {
            $('#additional_div').html('');
            $.each(json_field.additional_values, function (index, value)
            {
                var newCondition = $('#dynamicContent .condition-row').clone();
                $('#additional_div').append(newCondition);
                $.fn.add_remove_delete();
                $('#additional_div').find('.condition-row:last input[name="additional_label"]').val(value.additional_label);
                $('#additional_div').find('.condition-row:last input[name="additional_value"]').val(value.additional_value);
            });
        }
    }

    $('#txt_contact_id').val(data.id);
    $('#txt_name').val(data.contact_name);
    $('#txt_mobile_no').val(data.mobile);
    $('#txt_email').val(data.email);
    $('#txt_email').attr('data-edit-value', data.email);
    $('#txt_password').val(data.password);
    $('#txt_designation').val(data.designation);
    $('#chk_client_notification').prop('checked', parseInt(data.send_notifications) ? true : false);

    $.fn.populate_fileupload(data, 'name_card_attachment', true);

    if ($("#name_card_attachment").html().length > 0) 
    {
        $('#browse_file_div').hide();
        $("#name_card_attachment").find('.col-sm-4').toggleClass('col-sm-4 col-sm-12');
    }
    else
    {
        $('#browse_file_div').show();
    }

    $('#btn_contact_save').html('Update');

    $('#new_contact_div').slideDown();
    $('#btn_add_pic').show();
    // } 
    // catch (err) 
    // {
    //     $.fn.log_error(arguments.callee.caller, err.message);
    // }
};

$.fn.populate_contacts_list = function (data)
{
    try 
    {
        $("#table_pic_list").empty();
        if (data.length > 0)
        {
            let row = '';
            for (let i = 0; i < data.length; i++)
            {
                let json_field = $.fn.get_json_string(data[i].json_field);
                let service_offered = '';
                let contact_id = data[i].id;
                if (json_field != false)
                {
                    service_offered = json_field.service_offered;
                }
                let delete_html = ``;
                if (SESSIONS_DATA.is_admin == 1 && MODULE_ACCESS.delete == 1)
                {
                    delete_html = `<a style="cursor:pointer;" class="action-icon" onclick="$.fn.delete_sh_contact('${ contact_id }');">
                                        <i class="mdi mdi-delete" aria-hidden="true"></i>
                                    </a>`;
                }
                row = `<tr id="cr-${ contact_id }">
                            <td class='td-shrink' style="width:90px">
                                <a style="cursor:pointer;" class="action-icon" data-value='${ encode(JSON.stringify(data[i])) }' onclick="$.fn.populate_contact_details(decode($(this).attr('data-value')));">
                                    <i class="fas fa-edit fa-xs" aria-hidden="true"></i>
                                </a>
                                ${ delete_html }
                            </td>
                            <td>${ data[i].contact_name }</td>
                            <td>${ data[i].email }</td>
                            <td>${ data[i].mobile }</td>
                            <td>${ data[i].designation }</td>
                            <td><div id="${ 'contact-' + contact_id }"></div></td>
                        </tr>`

                $("#table_pic_list").append(row);
                $.fn.populate_fileupload(data[i], 'contact-' + contact_id, true);
                $("#table_pic_list").find('#contact-' + contact_id + ' .col-sm-4').toggleClass('col-sm-4 col-sm-12');
            }

        }
        else
        {
            $("#table_pic_list").append
                (
                    `<tr>
                    <td colspan="5">
                        <div class='list-placeholder' >No Records Found</div>
                    </td>
                </tr>`
                );
        }
    }
    catch (err) 
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_comment_row = function (row_data, is_list = false)
{
    try
    {
        let row = '';
        let row1 = '';
        let COMM_ID = row_data.id;
        let photo = CURRENT_PATH + '/assets/img/profile_default.jpg';
        if (row_data.emp_photo != '')
        {
            photo = row_data.emp_photo;
        }

        //let date = moment(row_data.created_date).format(UI_DATE_FORMAT + " h:ma");

        row += `<ul class="panel-comments">
                    <li>
                        <img src="${ photo }" alt="profile">
                        <div class="content">
                            <span class="commented"><a href="#">${ row_data.name }</a> communicated on <a href="#">${ row_data.created_date }</a> with <b>${ row_data.contact_name }</b> via <b>${ row_data.comm_type }</b></span>
                            ${ decode(row_data.descr) } <br/><br/>
                            <div id="${ 'comment-' + COMM_ID }"></div>
                        </div>
                    </li>
                </ul>`;

        row1 = `<div class="d-flex align-items-start mb-3 mt-3">
								<div style="margin-right:0.75rem" class="avatar-initials small" width="30" height="30" data-name="" ></div>
								<div class="w-100">
									<h5 class="mt-0"><small class="text-muted"><a href="#">${ row_data.name }</a> communicated on <a href="#">${ row_data.created_date }</a> with <b>${ row_data.contact_name }</b> via <b>${ row_data.comm_type }</b></small></h5>
									${ decode(row_data.descr) }
									<div id="${ 'comment-' + COMM_ID }"></div>
								</div>
							</div>`;

        if (is_list)
        {
            $('#div_comm').append(row1);

            $.fn.populate_fileupload(row_data, 'comment-' + COMM_ID, true);
        }
        else
        {
            $('#div_comm').prepend(row1);
        }

    }
    catch (e)
    {
        console.log(e.message)
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.populate_added_contact = function ()
{
    $.fn.get_contacts_list();

    $.fn.get_contact_dropdown();
    $.fn.get_contacts_for_approval();

    $('#new_contact_div').hide();
    $.fn.get_contact_dropdown();
    $.fn.show_right_success_noty('Data has been recorded successfully');
};

function getInitials()
{
    var colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];
    $(".avatar-initials").each(function (index)
    {

        var avatarElement = $(this);
        var avatarWidth = avatarElement.attr('width');
        var avatarHeight = avatarElement.attr('height');
        var name = SESSIONS_DATA.name;
        var arr = name.split(' ');
        if (arr.length == 1)
            name = name + " " + name;
        var initials = name.split(' ')[0].charAt(0).toUpperCase() + name.split(" ")[1].charAt(0).toUpperCase();
        var charIndex = initials.charCodeAt(0) - 65;
        var colorIndex = charIndex % 19;

        avatarElement.css({
            'background-color': colors[colorIndex],
        })
            .html(initials);
    });
};

$.fn.add_edit_contacts = function ()
{
    try
    {
        if ($('#contacts_form').parsley().validate() == false)
        {
            btn_contact_save.stop();
            return;
        }
        else
        {
            let addtional_values = [];
            $("#additional_div .condition-row").each(function ()
            {
                let row_data = {};

                if ($(this).find("[name='additional_label']").val() != '' && $(this).find("[name='additional_value']").val() != '')
                {
                    row_data.additional_label = $(this).find("[name='additional_label']").val();
                    row_data.additional_value = $(this).find("[name='additional_value']").val();
                    addtional_values.push(row_data);
                }
            });

            let offerings = '';
            if ($('#dd_offerings').val() != null)
            {
                offerings = $('#dd_offerings').val().toString();
            }

            let json_field =
            {
                offerings: offerings,
                contact_status: $('#dd_contact_status').val(),
                user_status: $('#dd_user_status').val(),
                additional_values: addtional_values
            };

            let data =
            {
                id: $('#txt_contact_id').val(),
                name: $('#txt_name').val(),
                email: $('#txt_email').val(),
                password: $('#txt_password').val(),
                mobile: $('#txt_mobile_no').val(),
                designation: $('#txt_designation').val(),
                customer_id: $('#txt_client_id').val(),
                user_id: SESSIONS_DATA.id,
                emp_name: SESSIONS_DATA.name,
                send_notifications: $('#chk_client_notification').is(':checked') ? 1 : 0,
                json_field: json_field,
                client_id: SESSIONS_DATA.client_id
            }

            $.fn.write_data
                (
                    $.fn.generate_parameter('add_edit_contacts', data),
                    function (return_data)
                    {
                        if (return_data.data)
                        {
                            let client_id = $('#txt_client_id').val();
                            let contact_id = return_data.data.id;
                            FILE_UPLOAD_PATH = `../clients/${ client_id }/`;

                            let attachment_data =
                            {
                                id: '',
                                primary_id: client_id,
                                secondary_id: contact_id,
                                module_id: MODULE_ACCESS.module_id,
                                filename: '',
                                filesize: "0",
                                json_field: {},
                                user_id: SESSIONS_DATA.id
                            };

                            if ($('#files .file-upload.new').length > 0)
                            {
                                $.fn.upload_file('files', 'contact_id', contact_id,
                                    attachment_data, function (total_files, total_success, filename, attach_return_data)
                                {
                                    if (total_files == total_success)
                                    {
                                        $.fn.populate_added_contact();
                                    }
                                }, false, btn_contact_save);
                            }
                            else
                            {
                                $.fn.populate_added_contact();
                            }

                        }

                    }, false, btn_contact_save
                );

        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.get_contacts_list = function ()
{
    try 
    {
        let data =
        {
            customer_id: $('#txt_client_id').val(),
            user_id: SESSIONS_DATA.id,
            view_all: MODULE_ACCESS.viewall,
            client_id: SESSIONS_DATA.client_id
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_contacts_list', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        $.fn.populate_contacts_list(return_data.data);
                    }
                }, false, false, false, showErrorMsg = false
            );
    }
    catch (err) 
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.assign_client_contacts = function ()
{
    try
    {
        let contacts = $('.check_contact_id:checked').map(function (_, el)
        {
            return $(el).val();
        }).get();

        var data =
        {
            contacts: contacts,
            assign_to: $('#dd_assign_to').val(),
            customer_id: $('#txt_client_id').val(),
            client_id: SESSIONS_DATA.client_id
        };

        $.fn.write_data
            (
                $.fn.generate_parameter('assign_client_contacts', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        $.fn.show_right_success_noty('Contacts has been assigned successfully');
                        $.fn.get_contacts_for_approval();
                    }

                }, false, btn_assign_contact
            );

    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_employees_drop_down = function (data)
{
    try
    {
        if (data.length > 0)
        {
            $('#dd_employees').empty();
            $('#dd_employees').append(`<option value="">All</option>`);
            for (let i = 0; i < data.length; i++)
            {
                $('#dd_employees').append(`<option value="${ data[i].emp_id }">${ data[i].emp_name }</option>`);
            }

            $('#dd_employees').val('').trigger('change', [true]);
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_contacts_list_for_approval = function (data)
{
    try
    {
        $('#total_contacts').html(0);
        $('#tbl_contact_list tbody').empty();
        if (data.length > 0)
        {
            let row = '';
            for (let i = 0; i < data.length; i++)
            {
                row += `<tr id="TR_CONTACT_ROW_${ i }">
                        <td><input class="check_contact_id" type="checkbox" value="${ data[i].id }"></td>
                        <td>${ data[i].contact_name }</td>
                        <td>${ data[i].email }</td> 
                        <td>${ data[i].mobile }</td>
                        <td>${ data[i].emp_name }</td>
                        </tr>
                        `;
            }

            $('#tbl_contact_list tbody').append(row);
            $('#total_contacts').html(data.length);
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.get_contacts_for_approval = function (user_id = '', dd_status = true)
{
    try
    {
        let data =
        {
            customer_id: $('#txt_client_id').val(),
            user_id: user_id,
            client_id: SESSIONS_DATA.client_id

        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_contacts_for_approval', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        $.fn.data_table_destroy('tbl_contact_list');
                        $.fn.populate_contacts_list_for_approval(return_data.data.details);
                        $.fn.data_table_features('tbl_contact_list');

                        if (dd_status)
                        {
                            $('#dd_assign_to').val('').change();
                            $.fn.populate_employees_drop_down(return_data.data.employees);
                        }

                    }
                }, false, false, false, true
            );

        $('#client_id').val(client_id);
    }
    catch (err)
    {
        console.log(err.message);
        // $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_documents_list = function (data)
{
    try
    {
        if (data.length > 0)
        {
            $('#tbl_document_list > tbody').empty();
            let row = '';
            let status = '';
            for (var i = 0; i < data.length; i++)
            {
                let row_data = data[i];
                let date = moment(row_data.created_date).format(UI_DATE_FORMAT);
                if (data[i].is_archived == '1')
                {
                    status = 'Archived';
                }
                else if (data[i].total_approvers_count == data[i].total_approvals_count)
                {
                    status = 'Document Verified';
                }
                else if (data[i].total_approvals_count >= 1)
                {
                    status = 'Verification in Progress';
                }
                else if (data[i].is_to_verify == '1')
                {
                    status = 'Pending Verification';
                }
                else
                {
                    status = 'Draft';
                }


                row = `<tr id="TR_DOCUMENT_ROW_${ i }">
                        <td>${ row_data.doc_no }</td>
                        <td>${ row_data.contact_name }</td>
                        <td>${ date }</td> 
                        <td>${ row_data.category }</td>
                        <td>${ status }</td>
                        <td><div id="${ 'doc-attachment-' + row_data.doc_no }"></div></td>
                        </tr>
                        `;
                $('#tbl_document_list tbody').append(row);
                if (row_data.attachment)
                {
                    for (let j = 0; j < row_data.attachment.length; j++)
                    {
                        row_data.attachment[j]['name'] = row_data.attachment[j]['filename'];
                        row_data.attachment[j]['uuid'] = row_data.attachment[j]['id'];
                        row_data.attachment[j]['deleteFileParams'] = JSON.stringify(row_data.attachment[j]);
                        delete row_data.attachment[j]['filename'];
                        delete row_data.attachment[j]['id'];
                    }
                }
                $.fn.populate_fileupload(row_data, 'doc-attachment-' + row_data.doc_no);
                $("#tbl_document_list").find('#doc-attachment-' + row_data.doc_no + ' .col-sm-4').toggleClass('col-sm-4 col-sm-12');
            }
            $('#total_documents').html(data.length);
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.get_documents_list = function ()
{
    try
    {
        let data =
        {
            customer_id: $('#txt_client_id').val(),
            user_id: SESSIONS_DATA.id,
            view_all: MODULE_ACCESS.viewall,
            client_id: SESSIONS_DATA.client_id
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_documents_list_for_client', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        $.fn.data_table_destroy('tbl_document_list');
                        $.fn.populate_documents_list(return_data.data);
                        $.fn.data_table_features('tbl_document_list');

                    }
                }, false, false, false, true
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.deactivate_form = function (param, obj)
{
    try
    {
        let data = JSON.parse(param);

        var params =
        {
            id: data.id,
            user_id: SESSIONS_DATA.id,
            client_id: SESSIONS_DATA.client_id
        };

        bootbox.confirm
            ({
                title: "Deactivate Confirmation",
                message: "Please confirm before you deactivate.",
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
                                $.fn.generate_parameter('deactivate_clients', params),
                                function (return_data)
                                {
                                    if (return_data.data)
                                    {
                                        $.fn.show_right_success_noty('Data has been deactivate successfully');
                                        $('#btn_reset').trigger('click');
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

$.fn.populate_list_form = function (data, is_scroll)
{
    try
    {
        if (is_scroll == false)
        {
            $('#tbl_list > tbody').empty();
        }

        $('#total_records').html(data.total_records);

        if (data.list !== undefined && data.list.length > 0)
        {
            let row = '';
            let data_val = '';

            if (data.rec_index)
            {
                RECORD_INDEX = data.rec_index;
            }

            let replies = '';
            let btn = '';
            data = data.list;
            for (let i = 0; i < data.length; i++)
            {
                delete_btn = '';
                data_val = encode(JSON.stringify(data[i]));
                replies = $.fn.get_json_string(data[i].latest_comm);
                if (replies != false)
                {
                    replies = `<div class="task-assign"><i class="fa fa-exchange text-primary" aria-hidden="true"></i><strong> communicated with ${ replies.name } on ${ replies.created_date } via ${ replies.comm_type }</strong></div>`;
                }
                else
                {
                    replies = '';
                }

                row += `<tr id="TR_ROW_${ i }" data-value=${ data_val }>
                            <td>${ data[i].type }</td>
                            <td width="30%">${ data[i].name ?? data[i].short_name } <br/> ${ replies }</td> 
                            <td>${ data[i].account_manager_name }</td>
                            <td>${ data[i].industry_name }</td>
                            <td>${ data[i].client_status }</td>
                            <td>
                                <a class="tooltips btn btn-xs btn-success waves-effect waves-light" href="javascript:void(0)" data-value=${ data_val } onclick="$.fn.populate_detail_form(decode($(this).attr('data-value')))" data-trigger="hover" data-original-title="Edit data "><i class="fas fa-sign-in-alt"/></i></a>
                                <a class="tooltips btn btn-xs btn-danger waves-effect waves-light" href="javascript:void(0)" onclick="$.fn.delete_sh_record('${ data[i].id }', ${ i })" data-trigger="hover" data-original-title="Delete data "><i class="mdi mdi-delete"/></i></a>

                            `;

                if (SESSIONS_DATA.is_admin == 1 && MODULE_ACCESS.delete == 1)
                {
                    row += `&nbsp;&nbsp;<a class="tooltips" href="javascript:void(0)" onclick="$.fn.deactivate_form(decode( $(this).closest('tr').attr('data-value')),this )" data-trigger="hover" data-original-title="Deactivate data"><i class="fa fa-trash-o"/></a>`;
                }

                row += `</td></tr>`;
            }
            $('#tbl_list tbody').html(row);
            $.fn.data_table_features('tbl_list');
            $('#div_load_more').show();
        }


    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.add_edit_form = function ()
{
    try
    {
        if ($('#detail_form').parsley().validate() == false)
        {
            btn_save.stop();
            return;
        }
        else
        {
            let additional = [];
            let additional_inputs = $(".btn_add_additional");
            for (let i = 0; i < additional_inputs.length; i++)
            {
                let element = $(additional_inputs[i]);
                if (element.attr('data')) additional.push(JSON.parse(element.attr('data')))
            }

            let json_field =
            {
                office_tel: $('#txt_office_tel').val(),
                website: $('#txt_website').val(),
                address: encodeURIComponent($('#txt_address').val()),
                id_no: $('#txt_id_no').val(),
                bank: $('#dd_bank').val(),
                acc_no: $('#txt_acc_no').val(),
            };

            let assign_user_id = '';
            let type_id = '';

            if ($('#dd_assign_client').val() != null)
            {
                assign_user_id = $('#dd_assign_client').val().toString();
            }

            if ($('#dd_type').val() != null)
            {
                type_id = $('#dd_type').val().toString();
            }

            let data =
            {
                id: $('#txt_client_id').val(),
                type_id: type_id,
                name: $('#txt_client_name').val(),
                assign_user_id: assign_user_id,
                industry: $('#dd_industry').val(),
                client_status: $('#dd_client_status').val(),
                source: $('#dd_source').val(),
                remarks: $('#txt_client_remarks').val(),
                json_field: json_field,
                user_id: SESSIONS_DATA.id,
                additional: additional,
                client_id: SESSIONS_DATA.client_id
            }

            $.fn.write_data
                (
                    $.fn.generate_parameter('add_edit_client', data),
                    function (return_data)
                    {
                        if (return_data.data)
                        {
                            $('#txt_client_id').val(return_data.data);
                            $.fn.show_hide_form('EDIT');
                            $('#h4_primary_no').text('Customer ID : ' + return_data.data);
                            $.fn.show_right_success_noty('Stake Holder has been added successfully');
                        }

                    }, false, btn_save

                );

        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.intialize_datepicker = function ()
{
    try
    {
        var startdate = moment().subtract(30, 'days');
        var enddate = moment();
        $('#doc_search_date').daterangepicker({
            startDate: startdate,
            endDate: enddate,
            locale: {
                format: 'DD-MMM-YYYY'
            },
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, function (startdate, enddate)
        {
            $('#from_date').val(startdate.format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD"));
            $('#to_date').val(enddate.format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD"));
        });
        $('#from_date').val(startdate.format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD"));
        $('#to_date').val(enddate.format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD"));

    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.downlolad_excel = function ()
{
    try
    {
        let data =
        {
            date_from: $('#from_date').val(),
            date_to: $('#to_date').val(),
            client_name: $('#txt_search_client_name').val(),
            assigned_to: $('#dd_search_assigned_to').val(),
            type_id: $('#dd_search_type').val(),
            offering_id: $('#dd_search_offerings').val(),
            status_id: $('#dd_search_status').val(),
            source_id: $('#dd_search_source').val(),
            is_contacts: $('#chk_is_contacts').is(':checked') ? 1 : 0,
            is_date: $('#chk_is_date').is(':checked') ? 1 : 0,
            is_for_download: true,
            view_all: MODULE_ACCESS.viewall,
            user_id: SESSIONS_DATA.id,
            client_id: SESSIONS_DATA.client_id
        };

        let page = `${ appConfig.SERVER_URL }public/excel_download.php`;
        window.open(page + "?data=" + JSON.stringify(data) + "&method=stake_holders", '_blank');
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
        if (form == 'list')
        {
            $('#txt_search_client_name').val('');
            $('#dd_search_assigned_to').val('').change();
            $('#dd_search_type').val('').change();
            $('#dd_search_comm_type').val('').change();
            $('#chk_is_contacts').removeAttr('checked');
        }
        else if (form == 'form')
        {
            $('#txt_client_id').val('');
            $('#txt_client_name').val('');
            $('#txt_office_tel').val('');
            $('#txt_website').val('');
            $('#txt_address').val('');

            $('#dd_type').val('');
            $('#dd_industry').val('').change();
            $('#dd_source').val('').change();
            $('#dd_additional').val('').change();
            $('#txt_value').val('');
            $('#txt_c_services_offered').val('')
            $('#dd_client_status').val($("#dd_client_status option:first").val()).change();
            $('#txt_client_remarks').val('');
            $("#table_pic_list").empty();
            $('#div_comm').empty();

            $('#dd_assign_client').val('');

            $('#txt_id_no').val('');
            $('#dd_payment_mode').val('').change();
            $('#txt_acc_no').val('');

            $('#btn_save').removeAttr('disabled');
            $('#detail_form').find('.form-group').removeClass('has-success');
            $('#detail_form').find('.form-group').removeClass('has-error');
            $('#detail_form').find('.parsley-error-list').remove();

            $("#tbl_additional tbody").find("tr:not('#base_row')").remove();

            $.fn.reset_form('principal_form');
            $('#total_principal').html(0);
            $.fn.data_table_destroy('tbl_principal_list');
            $('#tbl_principal_list > tbody').empty();
            $.fn.data_table_features('tbl_principal_list');
        }
        else if (form == "modal")
        {
            $('#txt_contact_id').val('');
            $('#txt_name').val('');
            $('#txt_phone').val('');
            $('#txt_mobile_no').val('');
            $('#txt_email').val('');
            $('#txt_email').attr('data-edit-value', '');
            $('#txt_password').val('');
            $('#txt_designation').val('');
            $('#dd_offerings').val('');
            $('#dd_contact_status').val('').change();
            $('#dd_user_status').val(1).change();
            $('#chk_client_notification').prop('checked', true);
            $('#img_name_card').attr('src', '');
            $('#name_card_attachment').html('');
            $('#btn_contact_save').html('Save');
            $('#browse_file_div').show();

            $("#additional_div").html('');
            let newLabel = $("#dynamicContent .condition-row").clone();
            $("#additional_div").html(newLabel);
            $.fn.add_remove_delete();
        }
        else if (form == "comm")
        {
            $('#dd_com_medium option:eq(0)').prop('selected', true).change();
            $('#dd_com_medium option:eq(0)').prop('selected', true).change();
            $('#txt_comm').val('');
            $('#div_comm').empty();
            $("#files_comm").empty();
        }
        else if (form == 'additional_form')
        {
            $('#dd_additional').val('').change();
            $('#txt_value').val('');
        }
        else if (form == 'principal_form')
        {
            $('#principal_form').parsley().destroy();
            $('#dd_offerings_principal').val('').change();
            $('#dd_managers_principal').val('').change();
            $('#dd_principal_accounts').val('').change();
            $.fn.set_validation_form();
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.show_hide_form = function (form_status, reset_form)
{
    if (reset_form) $.fn.reset_form('form');

    if (form_status == 'NEW')
    {
        $('#list_div').hide(400);
        $('#new_div').show(400);
        $('#div_sub_details').hide();
        $('#h4_primary_no').text('');
        $("#btn_new").hide();
        $("#btn_search").hide();
        $("#search_div").hide();
        $('#btn_save').html('<i class="fa fa-check"></i> Save');
    }
    else if (form_status == 'EDIT')
    {
        $('#list_div').hide(400);
        $('#new_div').show(400);
        $("#btn_new").hide();
        $("#btn_search").hide();
        $('#div_sub_details').show();
        $('#btn_save').html('<i class="fa fa-check"></i> Edit');
    }
    else if (form_status == 'BACK')
    {
        $('#list_div').show(400);
        $('#new_div').hide(400);
        $("#btn_new").show();
        $("#btn_search").show();
    }
    else if (form_status == 'SEARCH')
    {
        $('#list_div').show(400);
        $("#btn_new").show();
        $("#btn_search").show();
        $("#tblList").show();


    }
};

$.fn.bind_command_events = function ()
{
    try
    {
        $('body').on('click', '.page-item', function ()
        {
            if (!$(this).find('.page-link').hasClass('disabled'))
            {
                let page_no = $(this).find('.page-link').attr('pn');
                let index = (page_no - 1) * LIMIT;
                $.fn.get_list(index);
            }
        });

        $("#btn_search").click(function (e)
        {
            e.preventDefault();
            $("#search_div").show();
            $("#btn_search").hide();
        });

        $("#closeSearch").click(function (e)
        {
            e.preventDefault();
            $("#search_div").hide();
            $("#btn_search").show();
        });
        $('#btn_new').click(function (e)
        {
            e.preventDefault();
            $.fn.show_hide_form('NEW', true);

        });

        $('#btn_back,#btn_cancel,#closeTaskWindow').click(function (e)
        {
            e.preventDefault();
            $.fn.show_hide_form('BACK');
            RECORD_INDEX = 0;
            //$.fn.get_list(false);
        });

        $('#btn_save').click(function (e)
        {
            e.preventDefault();
            btn_save = Ladda.create(this);
            btn_save.start();
            $.fn.add_edit_form();
        });

        $('#btn_search_action').click(function (e)
        {
            e.preventDefault();
            RECORD_INDEX = 0;
            $.fn.get_list(false);
            $.fn.show_hide_form('SEARCH')
            $("#search_div").hide();
        });

        $('#btn_reset').click(function (e)
        {
            e.preventDefault();
            RECORD_INDEX = 0;
            $.fn.reset_form('list');
            $.fn.intialize_datepicker();
            $.fn.get_list(false);
        });

        $('#btn_load_more').click(function (e)
        {
            e.preventDefault();
            $.fn.get_list(true);
        });

        $('#btn_contact_save').click(function (e)
        {
            e.preventDefault();
            btn_contact_save = Ladda.create(this);
            btn_contact_save.start();
            $.fn.add_edit_contacts();
        });

        $('#btn_comm_save').click(function (e)
        {
            e.preventDefault();
            btn_comm_save = Ladda.create(this);
            btn_comm_save.start();
            $.fn.add_edit_comm_form();
        });

        $('#btn_assign_contact').click(function (e)
        {
            e.preventDefault();
            $.fn.assign_client_contacts();
        });

        $('#btn_contact_cancel').click(function (e)
        {
            e.preventDefault();
            $('#new_contact_div').slideUp();
            $('#btn_add_pic').show();
        });

        $('#client_details_toggle').click(function (e)
        {
            e.preventDefault();
            $('#detail_form').slideToggle();
            $(this).find('.fa').toggleClass("fa-chevron-up fa-chevron-down");
        });


        $(document).on('change', '#dd_employees', function (e, isTriggered)
        {
            if (!isTriggered)
            {
                let emp_id = $(this).val();
                $.fn.get_contacts_for_approval(emp_id, false);
            }
        });

        $('#fileupload').bind('fileuploadadd', function (event, data)
        {
            $('#btn_attach_fileupload').hide();
        });

        $('#name_card_div').on('click', '.cancel', function (e) 
        {
            $('#btn_attach_fileupload').show();
        });

        $('#add-condition').click(function (e)
        {
            e.preventDefault();
            var newCondition = $("#dynamicContent .condition-row").clone();
            newCondition.insertAfter("#additional_div .condition-row:last");

            $.fn.add_remove_delete();
        });

        $('body').on('click', '.delete-condition', function (e)
        {
            $(this).parents('.condition-row').remove();
            $.fn.add_remove_delete();
        });

        $('body').on('click', '.btn_add_additional', function (e)
        {
            e.preventDefault();

            if ($('#dd_additional').val() != '' && $('#txt_value').val() != '')
            {
                $("span[data-select2-id='7']").removeClass("parsley-error");
                $('#dd_additional_error').removeClass("parsley-errors-list");

                $("#txt_value").removeClass("parsley-error");
                $('#txt_value_error').removeClass("parsley-errors-list");

                $('#dd_additional_error').hide();
                $('#txt_value_error').hide();
                $.fn.add_additional();
            }
            else
            {
                if ($('#dd_additional').val() == '' || $('#dd_additional').val() == null)
                {
                    $("span[data-select2-id='7']").addClass("parsley-error");
                    $('#dd_additional_error').addClass("parsley-errors-list");
                    $('#dd_additional_error').show();
                }
                if ($('#txt_value').val() == '')
                {
                    $("#txt_value").addClass("parsley-error");
                    $('#txt_value_error').addClass("parsley-errors-list");
                    $('#txt_value_error').show();
                }
            }
        });

        $('#btn_save_principal').click(function (e)
        {
            e.preventDefault();
            btn_save_principal = Ladda.create(this);
            btn_save_principal.start();
            $.fn.add_edit_form_principal();
        });

        $('#btn_cancel_principal').click(function (e)
        {
            e.preventDefault();
            $.fn.reset_form('principal_form');
        });

        $(document).on('change', '#dd_principal_accounts', function (e)
        {
            let contact_id = $('#dd_principal_accounts').val();
            if (contact_id)
            {
                $.fn.get_offerings_by_contacts(contact_id);
            }
        });

        $('#chk_is_date').click(function (e)
        {
            let chk_is_date = $('#chk_is_date').is(':checked');
            if (chk_is_date)
            {
                $('#date_container').show();
            }
            else
            {
                $('#date_container').hide();
            }
        });

        getInitials();

        $('#download_excel').click(function (e)
        {
            e.preventDefault();
            $.fn.downlolad_excel();
        });
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
        if (SESSIONS_DATA.is_admin == 0 || MODULE_ACCESS.create == 0)
        {
            $('#txt_client_name').attr("disabled", true);
            $('#dd_type').attr("disabled", true);
            $('#dd_assign_client').attr("disabled", true);
        }

        if (SESSIONS_DATA.is_admin == 0 || MODULE_ACCESS.approve == 0)
        {
            $('#transfer_contacts').hide();
        }
        $("select.form-control.not-multi").select2();
        $("#dd_additional").select2();
        $("#dd_contact_status").select2();
        $("#dd_offerings").select2();
        $("#dd_user_status").select2();

        $("select.form-control.multi").select2({ multiple: true });
        $('#detail_form').parsley
            ({
                classHandler: function (parsleyField)
                {
                    return parsleyField.$element.closest(".errorContainer");
                },
                errorsContainer: function (parsleyField)
                {
                    return parsleyField.$element.closest(".errorContainer");
                },
            });
        $('#contacts_form').parsley
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
        $.fn.get_client_drop_down_values();

        let search_params = new URLSearchParams(window.location.search);
        let client_id = search_params.get('id');
        if (client_id != null)
        {
            $.fn.navigate_form(client_id);
        }
        //$.fn.intialize_fileupload('fileupload_comm', 'files_comm');
        //$.fn.intialize_fileupload('fileupload','files');
        $('.populate').select2();
        $.fn.intialize_datepicker();
        $.fn.get_list(false);
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