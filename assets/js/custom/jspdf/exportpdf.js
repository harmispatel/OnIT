function exportTable2PDF(title,tableId,orientation){

    var doc = new jsPDF(orientation, 'pt', 'a4');

    var htmlcontent = $('#'+tableId+'').html();
    var $jQueryObject = $($.parseHTML(htmlcontent));
    $jQueryObject.find(".ng-hide").remove();
    $jQueryObject.find(".text-danger").remove();
    $jQueryObject.find(".collapse").remove();

    var i = 0;
    var columns = [],
        rows = [],
        ignoreColumn = [];

    $jQueryObject.find('tr').each(function() {
         if(i==0) {
            var k = 0, m = 0, n = 0;
             $(this).find('th').each(function (index, data) {
                 if($(this).attr('id') != "ignorePdf"){
                    columns[k] = $(this)[0].innerText.trim();
                     k++;
                 }
                 else{
                    ignoreColumn[m] = n;
                    m++;
                 }
                 n++;
             });
         }
         else{
             var l = 0, q = 0;
             var rowData = [];
             //$(this).filter(':visible').find('td').each(function(index,data) {
             $(this).find('td').each(function(index,data) {
                 if(ignoreColumn.indexOf(q) == -1){
                    rowData[l] = $(this)[0].innerText.trim();
                    l++;
                 }
                 q++;
             });
             if(l > 0) {
                 rows[i - 1] = rowData;
             }
             if(l == 0){
                 i = i - 1;
             }
         }
         i++;
     });

    var dateObj = new Date();
    var currentDate = dateObj.getDate()+"/"+(dateObj.getMonth() + 1)+"/"+dateObj.getFullYear();

    doc.autoTable(columns, rows, {
        theme: 'striped',
        margin: {top: 60},
        styles: {overflow: 'linebreak'},
        bodyStyles: {valign: 'top'},
        beforePageContent: function(data) {
            doc.text(title, 40, 50);
        },
        afterPageContent: function(data) {
            doc.text(currentDate, 40, doc.internal.pageSize.height - 30);
        }
    });
    doc.save(title.trim()+".pdf");

    /*    var i = 0;
     var source = "";
     source = source + '<div style="width:100%; height: 30px; text-align: center; float:left;"><h4>'+title+'</h4></div>';
     source = source + '<div style="width:100%; height: auto; text-align: center; float:left;"><table style="font-size: 9px; width: 100%; margin:0 auto;">';
     $('#pdfContent').find('tr').each(function() {

     if(i==0) {
     source = source + '<tr>';
     $(this).filter(':visible').find('th').each(function (index, data) {
     source = source + '<th>' + $(this)[0].innerText + '</th>';
     });
     source = source + '</tr>';
     }
     else{
     source = source + '<tr>';
     $(this).filter(':visible').find('td').each(function(index,data) {
     source = source + '<td>' + $(this)[0].innerText + '</td>';
     });
     source = source + '</tr>';
     }

     i++;
     });
     source = source + '</table></div>';
    //console.log(source);

    var elementHandler = {
        '#ignorePDF': function (element, renderer) {
            return true;
        }
    };

    doc.fromHTML(source,30,30,
        {
            'width': 125,'elementHandlers': elementHandler
        },
        function (dispose){
            doc.save(title.trim()+".pdf");
        }
    );*/
}

function exportResume2PDF(){

    var doc = new jsPDF('p', 'pt', 'a4');
    $('#pdfContent').css('background-color','#FFFFFF');
    html2canvas($('#pdfContent')[0], {
        background: "#FFFFFF",
        onrendered: function(canvas) {
            //var imgData = canvas.toDataURL('image/png');
            var imgData = canvas.toDataURL("image/jpeg", 1.0);
            doc.addImage(imgData, 'JPEG', 10, 10, 575, 835);
            doc.save('Resume.pdf');
            $('#pdfContent').removeAttr("style");
        }
    });

/*    doc.text("",0,0);
    doc.addHTML($('#pdfContent')[0], 30, 10, {
        'pagesplit': false
    },function () {
        doc.save('Resume.pdf');
    });*/
}


function exportTable2CSV(title,tableId){

    var clean_text = function(text){
        text = text.replace(/"/g, '""');
        return '"'+text+'"';
    };

    var htmlcontent = $('#'+tableId+'').html();
    var $jQueryObject = $($.parseHTML(htmlcontent));
    $jQueryObject.find(".ng-hide").remove();
    $jQueryObject.find(".text-danger").remove();
    $jQueryObject.find(".collapse").remove();

    var i = 0;
    var rows = [],
        ignoreColumn = [];
    rows[0] = title;
    rows[1] = "";
    $jQueryObject.find('tr').each(function() {
        if(i==0) {
            var k = 0, m = 0, n = 0;
            var columnData = [];
            $(this).find('th').each(function (index, data) {
                if($(this).attr('id') != "ignorePdf"){
                    columnData[k] = clean_text($(this)[0].innerText.trim());
                    k++;
                }
                else{
                    ignoreColumn[m] = n;
                    m++;
                }
                n++;
            });
            columnData = columnData.join(",");
            rows[2] = columnData;
        }
        else{
            var l = 0, q = 0;
            var rowData = [];
            $(this).find('td').each(function(index,data) {
                if(ignoreColumn.indexOf(q) == -1){
                    rowData[l] = clean_text($(this)[0].innerText.trim());
                    l++;
                }
                q++;
            });
            if(l > 0) {
                rowData = rowData.join(",");
                rows[i+2] = rowData;
            }
            if(l == 0){
                i = i - 1;
            }
        }
        i++;
    });

    rows = rows.join("\n");

    var csv = rows;
    var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    var download_link = document.createElement('a');
    download_link.href = uri;
    var ts = new Date().getTime();
    if(title==""){
        download_link.download = ts+".csv";
    } else {
        download_link.download = title+"-"+ts+".csv";
    }
    document.body.appendChild(download_link);
    download_link.click();
    document.body.removeChild(download_link);


}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}






