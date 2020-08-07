(function(){
    //sort product by title/name
        let compare = {
            name: function (a, b) {
                a = a.replace(/^the /i,'');
                b = b.replace(/^the /i, '');
                if (a < b){
                    return -1;
                } else {
                    return a > b ? 1 : 0;
                }
            },
            quantity: function(a, b){
                if (a < b){
                    return -1;
                } else {
                    return a > b ? 1 : 0;
                }
            },
            price: function(a, b){
                if (a < b){
                    return -1;
                } else {
                    return a > b ? 1 : 0;
                }
            },
            date: function(a, b){
                a = new Date(a);
                b = new Date(b);
                return a - b;
            }
        }

        console.log(compare);
        $('.sortable').each(function () {
            let $table = $(this);
            let $tbody = $table.find('tbody');
            let $controller = $table.find('th');
            let $tRows = $tbody.find('tr').toArray();

            $controller.on('click', function () {
                let $header = $(this);
                let $order = $header.data('sort');
                let column;

                if ($header.is('.ascending') || $header.is('.descending')){
                    $header.toggleClass('ascending descending');
                    $tbody.append($tRows.reverse());
                } else {
                    $header.addClass('ascending');
                    $header.siblings().removeClass('ascending descending');

                    if (compare.hasOwnProperty($order)){
                        column = $controller.index(this);

                        $tRows.sort(function (a, b){
                            a = $(a).find('td').eq(column).text();
                            b = $(b).find('td').eq(column).text();
                            console.log(compare);
                            return compare[$order](a, b);
                        });
                        $tbody.append($tRows);
                    }
                }
            })
        })

}())