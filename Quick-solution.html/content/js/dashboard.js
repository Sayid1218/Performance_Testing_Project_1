/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.097575, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0375, 500, 1500, "Delete user-1"], "isController": false}, {"data": [0.1675, 500, 1500, "Job Details"], "isController": false}, {"data": [0.0665, 500, 1500, "Get posted jobs"], "isController": false}, {"data": [0.9865, 500, 1500, "Delete user-0"], "isController": false}, {"data": [0.152, 500, 1500, "Apply Job"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.0, 500, 1500, "FiindJob"], "isController": false}, {"data": [0.06, 500, 1500, "Delete a job"], "isController": false}, {"data": [0.047, 500, 1500, "Get reviews"], "isController": false}, {"data": [0.006, 500, 1500, "Add Category"], "isController": false}, {"data": [0.004, 500, 1500, "Put an admin"], "isController": false}, {"data": [0.009, 500, 1500, "Delete user"], "isController": false}, {"data": [0.103, 500, 1500, "Delete Applied Jobs"], "isController": false}, {"data": [0.006, 500, 1500, "Admin or not"], "isController": false}, {"data": [0.0835, 500, 1500, "Get categories"], "isController": false}, {"data": [0.0, 500, 1500, "Get all jobs"], "isController": false}, {"data": [0.005, 500, 1500, "Get all user"], "isController": false}, {"data": [0.1135, 500, 1500, "Applied Jobs"], "isController": false}, {"data": [0.093, 500, 1500, "Post Jobs"], "isController": false}, {"data": [0.0115, 500, 1500, "Get userdetails"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 20000, 0, 0.0, 6727.6967999999515, 404, 119262, 5087.0, 12075.700000000004, 16044.200000000026, 47706.97, 127.87233226346814, 2036.0350476084677, 64.16718548201476], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete user-1", 1000, 0, 0.0, 4145.282999999993, 419, 6564, 4230.0, 6126.9, 6176.95, 6418.89, 8.898222135217383, 18.15272074264562, 3.5975234023242155], "isController": false}, {"data": ["Job Details", 1000, 0, 0.0, 3384.2749999999974, 442, 43515, 3085.0, 6235.8, 6625.95, 7524.35, 8.723034918308777, 7.939324749866974, 1.737792112631827], "isController": false}, {"data": ["Get posted jobs", 1000, 0, 0.0, 4595.228999999996, 444, 8093, 5767.0, 6162.9, 6182.9, 6759.99, 8.388487639563463, 1.9414761431411531, 3.4078231035726567], "isController": false}, {"data": ["Delete user-0", 1000, 0, 0.0, 435.3439999999998, 404, 1504, 417.0, 447.9, 469.0, 1434.8600000000001, 8.894818768067601, 1.641719479653102, 3.787247053591283], "isController": false}, {"data": ["Apply Job", 1000, 0, 0.0, 3502.832000000001, 440, 8029, 3800.0, 6036.9, 6064.95, 6780.0, 8.920527024736622, 2.8660677647835433, 2.2824004692197217], "isController": false}, {"data": ["Login", 1000, 0, 0.0, 11789.817999999994, 8408, 17273, 11733.5, 14378.9, 14874.5, 16342.150000000001, 56.75368898978434, 29.817856129398407, 118.60634222474461], "isController": false}, {"data": ["FiindJob", 1000, 0, 0.0, 36781.27600000005, 12904, 119262, 35243.0, 54507.2, 62202.74999999995, 79554.55000000003, 8.094085651614366, 896.2381851643504, 1.5176410596776935], "isController": false}, {"data": ["Delete a job", 1000, 0, 0.0, 4710.536000000002, 448, 6858, 5765.5, 6067.0, 6119.7, 6813.0, 8.388909861163542, 2.2528810662304433, 3.5882251163961243], "isController": false}, {"data": ["Get reviews", 1000, 0, 0.0, 3931.358999999998, 419, 6817, 3994.5, 6001.0, 6027.0, 6645.610000000001, 9.089173884985595, 24.418278669526728, 1.2515366384599305], "isController": false}, {"data": ["Add Category", 1000, 0, 0.0, 4914.204999999999, 420, 7359, 5028.0, 6047.0, 6079.0, 6808.99, 8.543430529094653, 2.7449107852266996, 4.204969713538774], "isController": false}, {"data": ["Put an admin", 1000, 0, 0.0, 9177.130000000005, 641, 12872, 9161.0, 11984.7, 12031.0, 12831.97, 8.626118160566564, 2.7714774168226555, 3.6981112036022665], "isController": false}, {"data": ["Delete user", 1000, 0, 0.0, 4580.786000000005, 830, 7347, 4641.5, 6556.9, 6597.95, 6855.0, 8.861320336730172, 19.7129762959681, 7.3555881701373504], "isController": false}, {"data": ["Delete Applied Jobs", 1000, 0, 0.0, 4134.751999999996, 444, 8951, 4983.0, 6042.0, 6147.799999999999, 6821.84, 8.535919147773832, 1.9755984746312483, 3.4677171537831195], "isController": false}, {"data": ["Admin or not", 1000, 0, 0.0, 4911.298999999987, 419, 7021, 5011.5, 6009.9, 6033.849999999999, 6746.77, 8.499354049092268, 2.075037609641667, 3.486063184198001], "isController": false}, {"data": ["Get categories", 1000, 0, 0.0, 3563.4579999999987, 418, 6803, 3794.5, 5975.8, 6011.95, 6131.370000000001, 9.30275826782641, 10.647297548723197, 1.308200381413089], "isController": false}, {"data": ["Get all jobs", 1000, 0, 0.0, 11720.991000000007, 1584, 54913, 12239.5, 14444.8, 14725.8, 16044.920000000002, 8.310065150910782, 1469.452038199292, 3.132505027589416], "isController": false}, {"data": ["Get all user", 1000, 0, 0.0, 4986.059000000001, 621, 7839, 5210.5, 6396.9, 6568.0, 7143.000000000001, 8.714217245435929, 137.83611008234936, 3.2933614003747116], "isController": false}, {"data": ["Applied Jobs", 1000, 0, 0.0, 3927.431000000002, 432, 17106, 4197.5, 6034.9, 6168.95, 6923.620000000001, 8.72356759020169, 9.498806506909066, 3.5354302245446294], "isController": false}, {"data": ["Post Jobs", 1000, 0, 0.0, 4362.911000000004, 447, 6835, 5198.5, 6068.9, 6095.95, 6813.98, 8.421549059734048, 2.4508023630866664, 10.354228775590983], "isController": false}, {"data": ["Get userdetails", 1000, 0, 0.0, 4998.962000000005, 419, 7101, 5238.0, 6379.099999999999, 6521.849999999999, 6723.97, 8.437465722795501, 17.212759663007617, 3.4112410246458373], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 20000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
