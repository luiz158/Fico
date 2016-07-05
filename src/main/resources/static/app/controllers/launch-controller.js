// mainApp é uma variavel global no arquivo mainApp.js
mainApp.controller('LaunchController', ['BankService', 'LaunchService', function(BankService, LaunchService){
	
	var self = this;
	self.init = function(){
		self.launch = {};
		self.bank = {};
		self.listAllLaunch();
		self.populateBanks();
		self.bankSelected = self.listBanks[0];
	};
	
	self.launch = {};
	self.bank = {};
	self.listAll = [];
	self.listBanks = [];
	self.bankSelected = null;
	self.launchType = 'RECEIPT';
	
	self.listAllLaunch = function(){
		console.log( 'listAllLaunch()...' );
		
		self.launchType = $("#typeId").val();
		LaunchService.findByType( self.launchType ).then(function(response){
			self.listAll = response.data;
		});
	}
		
	self.classSituation = function( launch ){
		var classSituation = "";
		if( launch.done == false && launch.late ){
			classSituation = "fa fa-thumbs-o-down fa-2x text-danger";
		}else if( launch.done == false && launch.late == false ){
			classSituation = "fa fa-clock-o fa-2x text-default";
		}else{
			classSituation = "fa fa-thumbs-o-up fa-2x text-success";
		}
		return classSituation;
	}
	
	self.populateBanks = function(){
		BankService.findAll().then(function(response){
			self.listBanks = response.data;
		});
	}
	
	self.postLaunch = function(){
		self.launch.bank = self.bankSelected;
		self.launch.type = self.launchType;
		console.log( self.launch );
		var launchResponse = LaunchService.postLaunch( self.launch ).success(function(launchSaved){
			self.launch = launchSaved;
			self.hideLaunchFormModal();
			var msg = self.launchType == 'PAYMENT' ? 'Pagamento cadastrado com sucesso!' : 'Recebimento cadastrado com sucesso!';
			sweetAlert("OK", msg, "success");
			return launchSaved;
		}).success(function(bankSaved){
			self.init();
		}).error(function(data, status) {
			sweetAlert("ERRO", data.message, "error");
        });
	}
	
	self.editLaunch = function( id ){
		var launchResponse = LaunchService.findLaunch( id ).success(function(launchFind){
			self.launch = launchFind;
			self.bankSelected = self.launch.bank;
			self.showLaunchFormModal( 'edit' );
		}).error(function(data, status) {
			sweetAlert("ERRO", data.message, "error");
        });		
	}
	
	self.confirmDeleteLaunch = function( id ){
		swal({   
			title: "Confirmar?",   
			text: "Atenção! Confirmar a exclusão do Lançamento.",   
			type: "warning",   
			showCancelButton: true, 
			cancelButtonText: "Cancelar",
			confirmButtonColor: "#DD6B55",   
			confirmButtonText: "Confirmar",   
			closeOnConfirm: false 
		}, function(){   
			self.deleteLaunch( id ); 
		});
	}
	
	self.deleteLaunch = function( id ){
		var launchResponse = LaunchService.deleteLaunch( id ).success(function(response){
			sweetAlert("OK", "Lançamento Deletado com sucesso!", "success");
			return response;
		}).success(function(bankSaved){
			self.init();
		}).error(function(data, status) {
			console.log( status );
			console.log( data.message );
			sweetAlert("ERRO", data.message, "error");
        });
	}	
	
	self.payLaunch = function( id ){
		var launchResponse = LaunchService.payLaunch( id ).success(function(response){
			console.log( response );			
			sweetAlert("OK", "Lançamento Atualizado com sucesso!", "success");
			return response;
		}).success(function(bankSaved){
			self.init();
		}).error(function(data, status) {
			sweetAlert("ERRO", data.message, "error");
		});
	}	
	
	self.createBank = function(){
		console.log( self.bank )
		var bankResponse = BankService.createBank( self.bank ).success(function(bankSaved){
			self.bankSelected = bankSaved;
			console.log( self.bankSelected );
			sweetAlert("OK", "Banco["+bankSaved.name+"] salvo com sucesso!", "success");
			return bankSaved;
		}).success(function(bankSaved){
			self.populateBanks();
			self.bankSelected = bankSaved;
			self.hideBankModal();
		}).error(function(data, status) {
			sweetAlert("ERRO", data.message, "error");
        });
	}	
	
	self.showLaunchFormModal = function(action){
		self.launch = action == 'new' ? {} : self.launch; 
		$('#modalLaunch').modal('show');
		$('#modalBank').modal('hide');
	}
	
	self.hideLaunchFormModal = function(){
		$('#modalLaunch').modal('hide');
		$('#modalBank').modal('hide');
	}
	
	self.showBankModal = function(){
		$('#modalLaunch').modal('hide');
		$('#modalBank').modal('show');
	}
	
	self.hideBankModal = function(){
		$('#modalLaunch').modal('show');
		$('#modalBank').modal('hide');
	}
	
	self.init();
	
}]);