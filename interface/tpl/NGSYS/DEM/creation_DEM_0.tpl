<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>D&eacute;mission</title>
	<link href="/NGSYS/include/style_nouveau/style_accueil.css" rel="stylesheet">
    <link href="/NGSYS/include/bootstrap-3.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
	<link href='https://use.fontawesome.com/releases/v5.0.8/css/all.css' type='text/css' rel='STYLESHEET' />
	<script type='text/javascript' src='/NGSYS/include/script/association.js'></script> 
	<script type='text/javascript' src='/NGSYS/include/script/vocabulaire.js'></script>
	<script type='text/javascript' src='/NGSYS/include/script/fermeture.js'></script>
	<script type='text/javascript' src='/NGSYS/include/script/saisie.js'></script>
	<script type='text/javascript' src='/NGSYS/include/script/calendrier.js'></script>
	<script type='text/javascript' src='/NGSYS/include/script/attente_fichier.js'></script>
	<script type='text/javascript' src='/NGSYS/include/script/recupcontrolsaisie.js'></script>
	<script type='text/javascript' src='/NGSYS/include/script/navigation.js'></script>
	<script type='text/javascript' src='/NGSYS/include/script/action_tableau.js'></script>
	<script type='text/javascript' src='/NGSYS/include/script/ajax_search.js'></script>
	<script language='javascript' src='/NGSYS/include/script/ajax_recup_listhier.js'></script>
	<script language='javascript' src='/NGSYS/include/script/ajax_recup_arbo_dossier.js'></script>
	<script language='javascript' src='/NGSYS/include/script/action_accueil.js'></script>

	<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css" rel="stylesheet"/>
    <link href="https://raw.githack.com/ttskch/select2-bootstrap4-theme/master/dist/select2-bootstrap4.css" rel="stylesheet"/>

	<style>
		.col_list{
			width: 23%;
			float: right;
			/*margin-right: 3%;*/
		}

		.col1_partie{
			width: 100%; 
			font-family: 'Times New Roman';
			font-size: 14px;
			font-weight: lighter;
			background: #4a67b3;
			color: #fff; 
			padding-top: 9px; 
			border-top-right-radius: 6px;
			border-top-left-radius: 6px;
		}
		
		.col2_partie{
			width:100%; 
			border: 1px solid #4a67b3; 
			margin: -1% 0%; 
			padding: 9px;
			padding-top: 5px;
		}
		
		input.btn{
			width: 12%;
			border: 1px solid #4a67b3;
			text-align: center;
			color: #4a67b3;
			margin: 2.5%;
			background:transparent
		}

		.parsley-error{
			 border-style: solid;
  			border-color: red;
		}
	</style>
	<!-- JQUERY UI -->
		<link href="../../../../include/libraries/jquery-ui/css/smoothness/jquery-ui-1.10.3.custom.css" rel="stylesheet" type="text/css" />
	<!-- END JQUERY UI -->
</head>
<body  class='tpl_creation tpl_creation_dem' onLoad='initTplCreation();' style="background-color: transparent;font-family: 'Times New Roman';">
	<form name='principal' id="formdemission" ACTION='{URL_ATTENTE}' method='POST' onSubmit='return validerCreation();'>
        <div style="display: flex; flex-direction: row; justify-content: space-around; margin-top: 1%;">
			
				<input type='hidden' name='URL' value='{CODE_ACTION}'>
				<input type='hidden' name='POS_NUM_DOC' value='{POS_NUM_DOC}'>
				<input type='hidden' name='POS_TYPEDOC' value='DEM'>
				<input type='hidden' name='MODE' value='{MODE}'>
				<input type='hidden' name='NB_ONGLETS' value='2'>
				
				<!-- important pour lancer la boite aux lettres  -->
				<input type="hidden" name="URL_ATTENTE" value="{URL_ATTENTE}"> 
				<input type="hidden" name="URL_RESULTAT" value="{URL_RESULTAT}">
				<input type="hidden" name="URL_OBTENIR_NB_REP" value="{URL_OBTENIR_NB_REP}">
				<input type="hidden" name="URL_CHANGER_PROFIL" value="{URL_CHANGER_PROFIL}">
				<input type="hidden" id="nb-profils" value="{NB_PROFILS_UTIL}">
				<!-- end important pour lancer la boite aux lettres  -->

				<input type='hidden' class='appName' value="{NOM_APPLICATION}">

				 
        </div>

		<div class="col_list">
			<i class="fa fa-eye fa-1x" style="color:#4a67b3;"></i>
			<a href="javascript:void lanceBibBal('/{NOM_APPLICATION}/interface/session/principal/resultat/rechercher_db.php&TYPE_RECHERCHE=RECHERCHE_BAL&POS_QUEST_NOM=Bal_DEM_nv&POS_QUEST_PUBLIC=1', 'QUESTION_BAL');">
				<span style="color:#4a67b3;">Cliquez pour consulter la liste</span>
			</a>
		</div>

		<nav class="container-fluid">
			<div class="col-sm-12 mt-5" style="margin-top: 3%;">
				<div class="col1_partie text-center">
					<span class="title text-while">DESCRIPTIF</span>
				</div>
				<div class="col2_partie" style="padding-top: 3%;">

					<div class="row">
						<div class="col-sm-4">
							<label for="bio">Nom & pr&#233;noms :</label>
							<select id="interimaire" class="form-control select2 personnel" name='POS_VAL_RUB_INT' style="width: 100%;">
							    <option value="">Veuillez s&#233;lectionner</option>
							</select>
							<input type="hidden" name='POS_VAL_CTRL_INT' id='POS_VAL_CTRL_INT' value='{POS_VAL_RUB_INT}'>
						</div>
						<div class="col-sm-4">
							<label for="bio">Fonction :</label>
							<input type="text" name='POS_VAL_RUB_FON'  value="{POS_VAL_RUB_FON}" placeholder="Fonction" class="form-control" style="width: 100%;">
						</div>
						<div class="col-sm-4">
							<label for="bio">Ancienn&#233;t&#233; :</label>
							<input type="text" name='POS_VAL_RUB_AVA' value="{POS_VAL_RUB_AVA}" class="form-control" style="width: 100%;">
						</div>
					</div>

					<div class="row" style="margin-top: 13px">
						<div class="col-sm-4">
							<label for="bio">Date de depot :</label>
							<input  type="text" placeholder="jj/mm/aaaa" name="POS_VAL_RUB_DT4" value="{POS_VAL_RUB_DT4}" class="form-control dateDepot" id="date1" style="width: 100%;">
						</div>
						<div class="col-sm-4">
							<label for="bio">Pr&#233;avis :</label><br>
								<input type="radio" name="POS_VAL_RUB_AUS" class="val_1"  value="OUI" id="ouiboxEX">
								<label for="bio" style="font-size: 10px">Oui</label>
								<input type="radio" name="POS_VAL_RUB_AUS" class="val_1"  value="NON" checked id="nonboxEX" style="margin-left: 7%">
								<label for="bio" style="font-size: 10px">Non</label>
								<input type="hidden" name='POS_VAL_CTRL_AUS' id='POS_VAL_CTRL_AUS' value='{POS_VAL_RUB_AUS}'>
						</div>
	
					</div>

					<div class="row" style="margin-top: 13px;display: none;" id="dureeDatefin">
						<div class="col-sm-4">
							<label for="bio">Dur&#233;e de p&#233;avis :</label>
							<input type="number" min="0" name='POS_VAL_RUB_DUR' value="{POS_VAL_RUB_DUR}" class="form-control dureePreavis" placeholder="Dur&#233;e de p&#233;avis" style="width: 100%;">
						</div>
						<div class="col-sm-4">
							<label for="bio">Date de fin :</label>
							<input type="text" name="POS_VAL_RUB_DFI" value="{POS_VAL_RUB_DFI}"  readonly="true" placeholder="jj/mm/aaaa" class="form-control dateFin" id="date2" style="width: 100%;">
						</div>
					</div>

					<div class="row" style="margin-top: 13px">
						<div class="col-sm-12">
							<label for="bio">Motif de la d&#233;mission</label>
							<textarea type="text" rows="3" class="form-control" name='POS_VAL_RUB_MPO' style="width: 100%; resize: none">{POS_VAL_RUB_MPO}</textarea>
						</div>
					</div>

				</div>
			</div>
			<!-- button -->
			<div class="row col_btn">
				<input type="resset" class="btn col-sm-2 btn_ferme" value="FERMER" style="font-size: 12px;margin-left: 36%;">
				<input class="btn col-sm-2" type="submit" value="SUIVANT" style="font-size: 12px;margin-left: 5%;" />
			</div>  
		</nav>
			
	</form>
</body>
	<!-- JQUERY  -->
		<script language='javascript' src="../../../../include/jQuery/jquery.3.3.1.js" charset="utf-8"></script>
	    <script language='javascript' src="../../../../include/bootstrap-3.3.7/dist/js/bootstrap.min.js"></script>
		<script language='javascript' src='/{NOM_APPLICATION}/include/jQuery/parseley.js'></script>
	    <script language='javascript' src='/{NOM_APPLICATION}/include/jQuery/parseleyfr.js'></script>
		<script language='javascript' src="/{NOM_APPLICATION}/include/jQuery/jquery-ui.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js"></script>
		<script language='javascript' src="/{NOM_APPLICATION}/interface/tpl/{NOM_APPLICATION}/DEM/select2/select2tr.js"></script>

	<!-- END JQUERY  -->
	 <script>

	 

	var nom=$('.nom').val();
	var prenom=$('.prenom').val();
	var fonction=$('.fonction').val();
	var departement=$('.departement').val();

	  $('.viewnom').val(nom);
	  $('.viewprenom').val(prenom);
	  $('.viewfonction').val(fonction);
	  $('.viewdepartement').val(departement);
	 //fin donn??es de l'utilisateur connect??

	 $('#formdemission').parsley();

	$(document).ready(function (){

		//script du bouton fermer
		$('.btn_ferme').on('click',function(){
			 if (confirm("Voulez-vous fermer le formulaire ?.Vos donn\u00e9s seront annul\u00e9es ." ) ) {
						{CODE_ACTION_FERMER}
			}
		});

		// script bouton radia
		$("#nonboxEX").attr('checked', 'checked');
    	$("#nonboxEX").click(function(){
    		$("#nonboxEX").attr('checked', 'checked');
    		$('#dureeDatefin').css('display','none');
    	});
    	$("#ouiboxEX").click(function(){
    		if ($("#ouiboxEX").attr('checked', 'checked')){
    			$('#dureeDatefin').css('display','block');
    		}
    		else{
    			$('#dureeDatefin').css('display','none');
    		}
    	});


    	


		$("#date1,#date2").datepicker({
            altField: "#datepicker",
            closeText: 'Fermer',
            prevText: 'Pr??c??dent',
            nextText: 'Suivant',
            currentText: 'Aujourd\'hui',
            monthNames: ['Janvier', 'F??vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Ao??t', 'Septembre', 'Octobre', 'Novembre', 'D??cembre'],
            monthNamesShort: ['Janv.', 'F??vr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Ao??t', 'Sept.', 'Oct.', 'Nov.', 'D??c.'],
            dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
            dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
            dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            weekHeader: 'Sem.',
            dateFormat: 'dd/mm/yy'
        });


	});

	function timeConverter(UNIX_timestamp){
		var a = new Date(UNIX_timestamp * 1000);
		var months = ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','A\u00f4ut','Septembre','Octobre','Novembre','D\u00e9cembre'];
		var year = a.getFullYear();
		//var month = months[a.getMonth()];
		var month = a.getMonth();
		var date = a.getDate();     
		var hour = a.getHours();
		var min = a.getMinutes();
		var sec = a.getSeconds();
		var weekday = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
		//var dayGetName=weekday[a.getDay()];
		var dayGetName=a.getDay();
		hour1 = hour > 9 ? hour : '0' + hour;
		min1 = min > 9 ? min : '0' + min;
		sec1 = sec > 9 ? sec : '0' + sec;
		//var time = dayGetName + ' ' +date + ' ' + month + ' ' + year + ' \u00E0 ' + hour1 + ':' + min1 + ':' + sec1 ;

		
		d1 = date > 9 ? date : '0'+date;
		m1 = month > 9 ? month : '0'+month;



		var time =d1 +'/'+ m1+'/'+year ;
		return time;    
	}

	function addMonths(date, months) {
		var d = date.getDate();
		date.setMonth(date.getMonth() + +months);
		if (date.getDate() != d) {
		date.setDate(0);
		}
		return date;
	}

	$(document).on('change keyup','.dureePreavis, .dateDepot',function(){
		    var dureemois=parseInt($('.dureePreavis').val());
			var datedepo_sp=($('.dateDepot').val()).split('/');
			var datedepo_sp_str=datedepo_sp[2]+'-'+datedepo_sp[1]+'-'+datedepo_sp[0];
			var formattedDatedepo = new Date( datedepo_sp_str); //date de debut
         	var result_date_mois = addMonths(formattedDatedepo,parseInt(dureemois)+0);   //calcul des durees en mois

			var d = result_date_mois.getDate();
			var m =  result_date_mois.getMonth();
			m += 1;  // JavaScript months are 0-11
			var y = result_date_mois.getFullYear();

			d1 = d > 9 ? d : '0'+d;
			m1 = m > 9 ? m : '0'+m;

			formatDeb= d1 + "/" + m1 + "/" + y;

			d1 = d > 9 ? d : '0'+d;
			m1 = m > 9 ? m : '0'+m;

			formatDeb= d1 + "/" + m1 + "/" + y;

            date1=y+"-" +m1+"-"+ d1;  

			timestpdeb=new Date(date1);
			tamp1=parseInt( parseInt(timestpdeb.getTime())/1000 );

			$('.dateFin').val(timeConverter(tamp1) ) ;




			
			console.log(tamp1); //Date de fin contrat format: 2019-10-02




	});
	


	
		 
	</script>
	
</html>