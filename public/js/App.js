(function(){
	$('document').ready(function () {
		let $pTable = $('.sortable');
		let $pTbody = $pTable.find('tbody');
		let $theader = $pTable.find('th');
		let $row = $pTbody.find('tr');
		let $clear = $('#clear');
		let $delLink = $pTbody.find('tr td ');

		//sort table data after page load.
		sortData();
		/* BEGIN EVENTS */
		$('#form').on('submit', function(e){
			e.preventDefault();
			postData();
		});

		$theader.on('click', function (e) {
			e.preventDefault();
			sortData();
		})

		$pTbody.on('click', 'tr td a', function(e){
			e.preventDefault();
			let $this = $(this);
			getLink($this);
		})
		$pTbody.on('click', 'tr ', function(e){
			e.preventDefault();
			let $this = $(this);
			$this.addClass('active').siblings().removeClass('active');
			editData($this);
		})


		$clear.on('click', clear);

		$delLink.on('click', 'a',function(e){
			e.preventDefault();
		});

		/* END OF EVENTS */

		// After document loads,
		//populate table with data from server
		getData();

		//sort table data after page load.
		sortData();

		function getLink(b){
			let $productId = b.attr('href');
			$('#hidden').attr('value',$productId);
			removeProduct($productId);
		}

		function editData(a){
			let $productName = a.find(' td ').eq(0).toArray()[0].innerText;
			let $quantityInStock = a.find(' td ').eq(1).toArray()[0].innerText;
			let $pricePerItem = a.find(' td ').eq(2).toArray()[0].innerText;
			let $productId = a.find('a').attr('href');

			$('#productName').val($productName);
			$('#quantityInStock').val($quantityInStock);
			$('#pricePerItem').val($pricePerItem.substr(1));

			$('#hidden').attr('value',$productId);
		}

		//create product
		function postData(){
			const productName = document.getElementById('productName'); //$('#productName').val();
			const quantityInStock = document.getElementById('quantityInStock');
			const pricePerItem = document.getElementById('pricePerItem');
			const action = 'saveProduct';

			let query = $('#hidden').attr('value');
			let currentId;
			if (query !== undefined || query !== null || query !== ''){
				query = query.split('?');
				currentId = query[0];

				let cmd = query[1];
				const productId = currentId || (+new Date()).toString(36).slice(-8);

				$.ajax({
					url: '/public/App.php',
					type: 'POST',
					dataType: 'JSON',
					data: {
						action: action,
						cmd: cmd || 'save',
						productId: productId,
						productName: productName.value,
						quantityInStock: quantityInStock.value,
						pricePerItem: pricePerItem.value,
					},
					success: function (data) {
						getData();
						$('.response').css({display: 'block'}).html(data).fadeOut(5000);
					},
					error: function (xhr, status, error) {
						let err = xhr.responseText;
						alert(err + ': There was a situation!');
					},
				});
			} else {
				alert ('Unknown data field');
			}

		}

		//function for fetching json data from server and populating table
		function getData(){
			let action = 'getProduct';
			refreshDataFields();
			$.ajax({
				url: '/public/App.php',
				type: 'POST',
				dataType: 'JSON',
				data: {action: action},
				success: function(data){
					let totalOfValueCol = [];
					let total = 0.00;
					let lastRow = '<tr>';

					$row = '<tr>';
					$.each(data, function (i, item) {
						$row += '<td>' +
							item.productName +
							'</td><td>' +
							item.quantityInStock +
							'</td><td>' +
							'$' +
							item.pricePerItem.toFixed(2) +
							'</td><td >' +
							item.dateSubmitted +
							'</td><td>' +
							'$' +
							item.totalValueNumber.toFixed(2) +
							'</td><td>'
							+ '<a id="edit" href='+'"'+`${item.id}`+'?edit"'+'>edit</a>' + '</td><td>'
							+ '<a id="remove" href='+'"'+`${item.id}` + '?delete"'+'>remove</a>' + '</td>'
							totalOfValueCol[i] = item.totalValueNumber;
						$row += '</tr>';
					});

					totalOfValueCol.forEach(function (value) {
						total += Number(value);
					})
					lastRow += '<td>'+  'TOTAL' +'</td><td>' + '</td><td>' + '</td><td>'   + '</td><td>'+'$' + total.toFixed(2) + '</td>';
					lastRow  += '</tr>';
					$pTbody.html($row);
					$pTbody.append(lastRow);
				},
				error: function (xhr, status, error) {
					let err = xhr.responseText;
					alert(err);
				}
			})
		}

		//Delete selected product
		function removeProduct(b){
			let action = 'removeProduct';
			let query = b.split('?');
			let productId = query[0];
			let cmd = query[1];

			if (cmd === 'delete'){
				$.ajax({
					url: '/public/App.php',
					type: 'POST',
					dataType: 'JSON',
					data: {
						productId: productId,
						action: action
					},
					success: function(data){
						getData();
						$('.response').css({display: 'block'}).html(data).fadeOut(5000);
					},
					error: function(xhr, status, error){
						let err = xhr.responseText;
					}
				})
			}
		}

		//sort product by title/name
		function sortData(){
			let compare = {
				name: function (a, b) {

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
								return compare[$order](a, b);
							});
							$tbody.append($tRows);
						}
					}
				})
			})
		}
		//Clear form fields
		function clear(){
			refreshDataFields();
		}
		function refreshDataFields(){
			$('#productName').val('');
			$('#quantityInStock').val('');
			$('#pricePerItem').val('');
			$('#hidden').attr('value','');
		}
	});
}())