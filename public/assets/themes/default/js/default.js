$(document).ready(function(){  
	$("#productGridWrap").gridalicious({selector: '.productGrid', gutter: 10, width: 300}); 


	// when user input quantity on sidebar
	$('#sideQnty').on('keyup mouseup change', function(){
		var intOrderQuantity = $(this).val() == '' || $(this).val() < 0 ? 0 : parseInt($(this).val());
		var intPrice = $('#sideTotal').data('price'); 
		var intPriceNew = intOrderQuantity * intPrice; 
		
		// check if valid order quantity
 		if(intOrderQuantity < 1 ){ 
 			$('#sideOrderBtn, #sideOrderForm').addClass('disabled');  
 		}else{ 
 			$('#sideOrderBtn, #sideOrderForm').removeClass('disabled');
 		}

		$('#sideTotal').text(intPriceNew);   
	})


	// when submitting the form
	$('#sideOrderForm').on('submit', function(){
		if($('#sideOrderForm').hasClass('disabled')){ 
			return false;
		}
	})
})