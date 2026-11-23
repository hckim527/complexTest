WebSquare.uiplugin.editor.prototype.setDisabled = function( disabled ) {
	["WebSquare.uiplugin.editor.setDisabled"];

	try {
		if( this.options.editorType === "2.0" ) {
			return;
		}
		
		disabled = WebSquare.util.getBoolean(disabled);
		this.options.disabled = disabled;
		var editorTop = null;
		var editor = null;
		var editorBottom = null;

		if (CKEDITOR.version.charAt(0) < "4") {
			var disabledDiv = document.getElementById( this.id + "_disabled_div" );
			editorTop = document.getElementById("cke_top_" + this.id + "_");
			editor = document.getElementById("cke_contents_" + this.id + "_");
		} else {
			var disabledDiv = document.getElementById( this.id + "_disabled_div" );
			editorTop = document.getElementById(CKEDITOR.instances[this.id+"_"].id + "_top");
			editor = document.getElementById(CKEDITOR.instances[this.id+"_"].id + "_contents");
		}

		if( !editorTop && !editor ) {
			return;
		}

		var iframe = editor.getElementsByTagName("iframe")[0];
		var editorFrame = iframe.contentWindow;

		if( disabled == false && disabledDiv ) {
			//this.render.removeChild( disabledDiv );
			disabledDiv.style.visibility = "hidden";
			disabledDiv.style.display = "none";
			disabledDiv.hidden=true;

			if( editorFrame && !this.getReadOnly()) {
				editorFrame.document.documentElement.contentEditable = true;
				editorFrame.document.body.contentEditable = true;
			}
		} else if( disabled == true && !disabledDiv ) {
			var disabled_div = document.createElement("div");
			disabled_div.setAttribute("id", this.id + "_disabled_div" );
			var gheigth=null;
			if (CKEDITOR.version.charAt(0) < "4") {
				var editorTop_height = document.getElementById("cke_top_" + this.id + "_").offsetHeight;
				var editorContents_height = document.getElementById("cke_contents_" + this.id + "_").offsetHeight;
				var editorBottom_height = document.getElementById("cke_bottom_"+this.id+"_").offsetHeight;
			} else {
				var editorTop_height = document.getElementById(CKEDITOR.instances[this.id+"_"].id + "_top").offsetHeight;
				var editorContents_height = document.getElementById(CKEDITOR.instances[this.id+"_"].id + "_contents").offsetHeight;
				var editorBottom_height = document.getElementById(CKEDITOR.instances[this.id+"_"].id + "_bottom").offsetHeight;
			}
			gheigth = editorTop_height+editorContents_height+editorBottom_height;

			var style=null;

			if( this.options.transParentDisabled == true ){
				style = "background-color: black; position: absolute; left:0px; top:0px; height:" + gheigth + "px; width: 100%; filter : alpha(opacity=0); opacity : 0.0;";
			} else {
				if( WebSquare.util.isSpartan() ){
					style = "background-color: black; position: absolute; left:0px; top:0px; height:" + gheigth + "px; width: 100%; filter : alpha(opacity=30); opacity : 0.3; border:1px solid black;";
				} else {
					style = "background-color: black; position: absolute; left:0px; top:0px; height:" + gheigth + "px; width: 100%; filter : alpha(opacity=30); opacity : 0.3;";
				}
				
			}
			
			disabled_div.style.cssText = style;
			this.render.appendChild( disabled_div );

			// contents 쪽은 다음과 같이 할 수 있다.
			editorFrame.document.documentElement.contentEditable = false;
			editorFrame.document.body.contentEditable = false;

		} else if(disabled == true && disabledDiv){
			editorFrame.document.documentElement.contentEditable = true;
			editorFrame.document.body.contentEditable = true;

			disabledDiv.hidden = false;
			disabledDiv.style.visibility = "visible";
			disabledDiv.style.display = "block";
		}
		return disabled;

	} catch (e) {
		WebSquare.exception.printStackTrace( e );
	}
};
