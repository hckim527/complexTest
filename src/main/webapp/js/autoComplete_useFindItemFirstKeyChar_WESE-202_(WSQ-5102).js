WebSquare.uiplugin.autoComplete.prototype.defaultOptions.useFindItemFirstKeyChar = true;
WebSquare.uiplugin.itemTable.prototype.defaultOptions.useFindItemFirstKeyChar = true;
WebSquare.uiplugin.autoComplete.prototype.findItemStartedWithKeyChar = function(e, code) {
    ["WebSquare.uiplugin.autoComplete.findItemStartedWithKeyChar"];
    try {

        if (this.options.useFindItemFirstKeyChar === false) {
            return;
        }
        
        var findKeyValue = this.keyCharHash[code];
        var findIndex = -1;

        if (findKeyValue) {
            var findKorValue = this.korCharHash[code];
            var findKorValue2 = this.korCharHash2[code];

            var index = this.selectedIndex;
            if (this.options.findItem) {
                this._keyBuffer += findKeyValue;
                index = 0;
            } else {
                this._keyBuffer = findKeyValue;
                index++;
            }
            
            var counter = 1;
            while (1) {
                index = index % this.itemArr.length;

                //hidden 처리
                if (this.itemArr[index]._hidden === true) {
                    index++;
                    continue;
                }

                // [[bug:3902]] 추가 요건
                // 입력된 key값은 대소문자 구별없이 소문자로 주어지기 때문에 대문자 입력시 대문자 아이템을 찾지 못하는 현상이 있다.
                // 대문자를 지원하기 위해서 아이템 라벨도 역시 소문자로 치환해준 후 비교한다.
                var labelLowerCase = this.itemArr[index].label.toLowerCase();
                if (index == 0 && (this.options.chooseOption === true || this.options.allOption === true)) {
                    if (this.itemArr.length <= 1) {
                        break;
                    } else {
                        index++;
                        continue;
                    }
                } 
                if ((index == 0 || index == 1) && (this.options.chooseOption === true && this.options.allOption === true)) {
                    if (this.itemArr.length <= 2) {
                        break;
                    } else {
                        index++;
                        continue;
                    }
                }
                var korFindFlag = false;
                if (findKorValue && !e.shiftKey) {
                    korFindFlag = this.myhelper.startWith(labelLowerCase, findKorValue);
                } else if (findKorValue2 && e.shiftKey) {
                    korFindFlag = this.myhelper.startWith(labelLowerCase, findKorValue2);
                }
                var compareStr = this.options.findItem ? this._keyBuffer : findKeyValue;
                if (labelLowerCase.startsWith(compareStr) || (korFindFlag && WebSquare.util.getBoolean(this.options.findItemKor))) {
                    findIndex = index;
                    break;
                } else {
                    if (labelLowerCase.startsWith(compareStr)) {
                        this._keyBuffer = "";
                        findIndex = index;
                        break;
                    }
                }
                if (counter > this.itemArr.length) {
                    break;
                }
                index++;
                counter++;
            }

            if (findIndex > -1) {
                this.setSelectedIndex1(findIndex);
                // [[bug:3902]],[[bug:3906]]
                // 외부에서 성공 여부를 판단해야 하기 때문에 결과를 리턴한다.
                return true; // 성공
            }
        }
        if (findIndex == -1) {
            this._keyBuffer = "";
            // [[bug:3902]],[[bug:3906]]
            // 외부에서 성공 여부를 판단해야 하기 때문에 결과를 리턴한다.
            return false; // 실패
        }
    } catch (e) {
        WebSquare.exception.printStackTrace(e, null, this);
    }
};

WebSquare.uiplugin.autoComplete.prototype.setSubLayer = function() {
    ["WebSquare.uiplugin.autoComplete.setSubLayer"];
    try {
        if (this.itemTable == null) {
            //this.itemChanged = true;
            var _this = this;
            if (this.itemTableMode == "grid") {
                this.itemTable = new WebSquare.uiplugin.gridItemTable(this.id + "_gridItemTable", {
                    itemsetObj: this.itemsetObj,
                    className: this.options.className,
                    gridOptions: this.gridOptions,
                    visibleRowNum: this.options.visibleRowNum,
                    findItemKor : this.options.findItemKor,
                    findItemFirstKey: this.options.findItemFirstKey,
                    parent_uuid : this.uuid
                });
                this.itemTable.writeTo(WebSquare.getBody(), null, this.parentFrame);
                this.itemTable.activate();
                this.itemTable.grid.addEvent("oncellclick", function(row, col) {
                    _this.findStop = true;
       				if (_this.editmode || _this.findkeymode) {
                        _this.mozTrickBuffer = "";
                    }
                    _this.focus();
                    if (_this.gridOptions.dataComp.initializeType === "dataList") {
                        row = this.getRealRowIndex(row);
                    }
                    _this.setSelectedIndex1(_this.viewArr[row].index);
                });
                /*this.itemTable.grid.addEvent("onrowindexchange", function(row, oldRow) {
                    if (_this.gridOptions.dataComp.initializeType === "dataList") {
                        row = this.getRealRowIndex(row);
                    }
                    _this.dom.input.value = (_this.options.searchTarget == "label" || _this.options.searchTarget == "both") ? _this.viewArr[row].orgLabel : _this.viewArr[row].value;
                    var label = _this.viewArr[row].label;
                    var encodedLabel = (_this.options.escape) ? _this._encode(label) : label;
                    encodedLabel = _this.getFormattedValue(row, encodedLabel);
                    _this.dom.label.innerHTML = encodedLabel;
                });*/
                this.event.addListener(this.itemTable.grid.render, "onkeydown", this.event.bindAsEventListener(this.itemTable.grid, function(e) {
                    var keyCode = (e.charCode) ? e.charCode : e.keyCode;
                    if (keyCode == 13) {
                        _this.focus();
                        var row = this.getFocusedRowIndex();
                        if (_this.gridOptions.dataComp.initializeType === "dataList") {
                            row = this.getRealRowIndex(row);
                        }
                        _this.setSelectedIndex1(_this.viewArr[row].index);
                    } else if (keyCode == 27) {
                        _this._closeSubLayer();
                        _this.showEditMode(false);
                        _this.focus();
                    }
                }));
                if (this.itemArr.length === 0) {
                    this.itemTable.hide();
                }
            } else if (this.itemTableMode == "gridView") {
                if (this.options.submenuSize == "auto") {
                    if (!this.gridViewOptions.width) {
                        this.gridViewOptions.parentWidth = this.render.offsetWidth;
                    }
                    this.gridViewOptions.autoFit = "allColumn";
                }
                this.itemTable = new WebSquare.uiplugin.gridViewItemTable(this.id + "_gridViewItemTable", {
                    itemsetObj: this.itemsetObj,
                    className: this.options.className,
                    gridViewOptions: this.gridViewOptions,
                    visibleRowNum: this.options.visibleRowNum,
                    findItemKor : this.options.findItemKor,
                    findItemFirstKey: this.options.findItemFirstKey,
                    parent_uuid : this.uuid
                });
                this.itemTable.writeTo(WebSquare.getBody(), null, this.parentFrame);
                this.itemTable.activate();

                this.itemTable.gridView.addEvent("oncellclick", function(row, col) {
                    _this.findStop = true;
       				if (_this.editmode || _this.findkeymode) {
                        _this.mozTrickBuffer = "";
                    }
                    _this.focus();
                    //rowIndex와 viewArr의 index랑 같다고 가정.
                    var searchText = _this.viewArr[row].orgLabel + "|" + _this.viewArr[row].value;
                    var idx = _this.findinItemArr(searchText, WebSquare.allValue || "all");
                    _this.setSelectedIndex1(idx);
                });

                /*this.itemTable.gridView.addEvent("onrowindexchange", function(row, oldRow) {
                    if (_this.gridViewOptions.dataComp.initializeType === "dataList") {
                        row = this.getRealRowIndex(row);
                    }
                    _this.dom.input.value = (_this.options.searchTarget == "label" || _this.options.searchTarget == "both") ? _this.viewArr[row].orgLabel : _this.viewArr[row].value;
                    var label = _this.viewArr[row].label;
                    var encodedLabel = (_this.options.escape) ? _this._encode(label) : label;
                    encodedLabel = _this.getFormattedValue(row, encodedLabel);
                    _this.dom.label.innerHTML = encodedLabel;
                });*/

                this.event.addListener(this.itemTable.gridView.render, "onkeydown", this.event.bindAsEventListener(this.itemTable.gridView, function(e) {
                    var keyCode = (e.charCode) ? e.charCode : e.keyCode;
                    if (keyCode == 13) {
                        _this.focus();
                        var row = this.getFocusedRowIndex();
                        if (_this.gridViewOptions.dataComp.initializeType === "dataList") {
                            row = this.getRealRowIndex(row);
                        }
                        _this.setSelectedIndex1(_this.viewArr[row].index);
                    } else if (keyCode == 27) {
                        _this._closeSubLayer();
                        _this.showEditMode(false);
                        _this.focus();
                    }
                }));

                if (this.itemArr.length === 0) {
                    this.itemTable.hide();
                }
            } else {
                this.itemTable = new WebSquare.uiplugin.itemTable(this.id + "_itemTable", {
                    row: this.options.visibleRowNum,
                    col: 1,
                    submenuSize: this.options.submenuSize,
                    style: "",
                    defaultStyle: "text-align:" + this.options.textAlign + ";" + this.options.defaultStyle,
                    className: "w2input_table " + this.options.className,
                    w2table: "w2input_table_sb",
                    w2table_main: "w2input_table_sb_main",
                    w2table_row: "w2input_table_sb_row",
                    w2table_col: "w2input_table_sb_col",
                    w2table_col_over: "w2input_table_sb_col_over",
                    escape: this.options.escape,
                    wheelRows : this.options.wheelRows,
                    parent_uuid : this.uuid,
                    selectByTabKey : this.options.selectByTabKey,
                    useFindItemFirstKeyChar : this.options.useFindItemFirstKeyChar,
                });

                this.itemTable.writeTo(WebSquare.getBody(), null, this.parentFrame);
                this.itemTable.activate();

                //		this.itemTable.setProperty("offsetTop","0");	// smkim. 주석. offsetTop : readOnly 속성
                this.itemTable.addClickEventListener(
                    function(e, index) {
                        ["WebSquare.uiplugin.autoComplete.itemTable.addClickEventListener"];
                        WebSquare.event.fireEvent(_this, "onitemclick", index);
                        _this.findStop = true;
                        var oldIndex = _this.selectedIndex;
                        var oldValue = _this.getValue();
                        if (_this.editmode || _this.findkeymode) {
                            _this.mozTrickBuffer = ""; //초기화 
                            var label = _this.viewArr[index].label;
                            if (_this.options.useKeywordHighlight) {
                                label = label.wq_replaceAll("<span class='w2autoComplete_keyword'>", "").wq_replaceAll("</span>", "");
                            }

                            _this.dom.input.value = label;
                            _this.selectedItem = {
                                text: label,
                                value: _this.viewArr[index].value,
                                orgLabel: _this.viewArr[index].orgLabel
                            };

                            //				    	_this.dom.label.innerHTML =  (_this.options.escape) ?  _this._encode(_this.viewArr[index].label) : _this.viewArr[index].label;
                            //todo 퍼포먼스 떨어지지만 찾아야 겠다.
                            var searchText = _this.selectedItem.orgLabel + "|" + _this.selectedItem.value;
                            var idx = _this.findinItemArr(searchText, WebSquare.allValue || "all");
                            _this.setSelectedIndex1(idx, true);
                            _this.focus();
                            _this.closeTable();
                        } else {
                            var label = _this.viewArr[index].label;
                            if (_this.options.useKeywordHighlight) {
                                label = label.wq_replaceAll("<span class='w2autoComplete_keyword'>", "").wq_replaceAll("</span>", "");
                            }
                            _this.dom.input.value = label;
                            _this.selectedItem = {
                                text: label,
                                value: _this.viewArr[index].value,
                                orgLabel: _this.viewArr[index].orgLabel
                            };
                            //				    	_this.dom.label.innerHTML = (_this.options.escape) ?  _this._encode(_this.viewArr[index].label) : _this.viewArr[index].label;
                            _this.setSelectedIndex1(index);
                            _this.focus();
                            _this.closeTable();
                        }
                        var info = {
                            "oldValue": oldValue,
                            "newValue": _this.getValue(),
                            "oldSelectedIndex": oldIndex,
                            "newSelectedIndex": _this.selectedIndex
                        };
                        WebSquare.event.fireEvent(_this, "onselected", info);
                    }
                );

                this.itemTable.addKeyDownEventListener(

                    function(e) {
                        if (WebSquare.util.isIEAllVersion()) {
                            if (e.srcElement.parentElement != this.render) {
                                return;
                            }
                        } else if (WebSquare.event.getTarget(e) !== this.render) {
                            return;
                        }

                        var keyCode = (e.charCode) ? e.charCode : e.keyCode;
                        if (keyCode == 27) {
                            _this._closeSubLayer();
                            _this.showEditMode(false);
                            _this.focus();
                            return;
                        }
                        if (_this.options.customToggleKey == keyCode) {
                            _this._closeSubLayer();
                            _this.focus();
                            return;
                        }
                        if (_this.options.findItemFirstKey) {
                            return;
                        }
                        if (_this.interactionMode == true || _this.editmode || _this.findkeymode) {
                            var viewIdx = 0;
                            var searchText = _this.selectedItem.orgLabel + "|" + _this.selectedItem.value;
                            for (var i = 0; i < _this.viewArr.length; i++) {
                                if (searchText == _this.viewArr[i].orgLabel + "|" + _this.viewArr[i].value) {
                                    viewIdx = i;
                                    break;
                                }
                            }

                            if (keyCode == 13 || (_this.options.selectByTabKey && keyCode == 9)) {
                                if (_this.viewArr.lenght == 0) {
                                    return;
                                }
                            } else if ((keyCode == 38) || (keyCode == 9 && e.shiftKey)) { //up
                                if (viewIdx == 0) {
                                    return;
                                }

                                viewIdx = viewIdx - 1;
                            } else if ((keyCode == 40) || (keyCode == 9)) { //down
                                if ((viewIdx + 1) == _this.viewArr.length) {
                                    return;
                                }
                                viewIdx = viewIdx + 1;
                            } else if (keyCode == 35) { // end
                                viewIdx = _this.viewArr.length - 1;
                            } else if (keyCode == 36) { // home
                                viewIdx = 0;
                            } else if (keyCode == 33) { // page up
                                viewIdx = viewIdx - _this.viewArr.length;
                                if (viewIdx < 0) {
                                    viewIdx = 0;
                                }
                            } else if (keyCode == 34) { // page down
                                viewIdx = viewIdx + _this.viewArr.length;
                                if (viewIdx >= _this.viewArr.length) {
                                    viewIdx = _this.viewArr.length - 1;
                                }
                            }

                            if (_this.viewArr.length > viewIdx) {
                                var label = _this.viewArr[viewIdx].label;
                                if (_this.options.useKeywordHighlight) {
                                    label = label.wq_replaceAll("<span class='w2autoComplete_keyword'>", "").wq_replaceAll("</span>", "");
                                }
                                _this.dom.input.value = label;
                                _this.selectedItem = {
                                    text: label,
                                    value: _this.viewArr[viewIdx].value,
                                    orgLabel: _this.viewArr[viewIdx].orgLabel
                                };
                                _this.itemTable.setSelectedIndex(viewIdx);
                            }

                        } else {
                            var selectedIndex = -1;
                            selectedIndex = _this.getSelectedIndex();
                            if ((keyCode == 38) || (keyCode == 9 && e.shiftKey)) { // up key
                                if (selectedIndex > 0) {
                                    selectedIndex = selectedIndex - 1;
                                }
                            } else if ((keyCode == 40) || (keyCode == 9)) { // down key
                                if (selectedIndex + 1 < _this.getItemCount()) {
                                    selectedIndex = selectedIndex + 1;
                                }
                            } else if (keyCode == 35) { // end
                                selectedIndex = _this.getItemCount() - 1;
                            } else if (keyCode == 36) { // home
                                selectedIndex = 0;
                            } else if (keyCode == 33) { // page up
                                selectedIndex = selectedIndex - _this.itemTable.rowCount;
                                if (selectedIndex < 0) {
                                    selectedIndex = 0;
                                }
                            } else if (keyCode == 34) { // page down
                                selectedIndex = selectedIndex + _this.itemTable.rowCount;
                                if (selectedIndex >= _this.itemTable.getItemCount()) {
                                    selectedIndex = _this.itemTable.getItemCount() - 1;
                                }
                            } else {
                                //							this.findItemStartedWithKeyChar(keyCode);
                                //							return;
                            }
                            _this.setSelectedIndex1(selectedIndex, true);
                            _this.itemTable.setSelectedIndex(selectedIndex);
                        }
                    }
                );

                if (this.options.closeonmouseleave == true) {
                    this.itemTable.addMouseLeaveEventListener(
                        function(e) {
                            ["WebSquare.uiplugin.autoComplete.itemTable.addMouseLeaveEventListener"];
                            var compHeight = _this.render.offsetHeight;
                            var compTop = _this.getAbsolutePosition("top");
                            if (!(e.clientY >= compTop && e.clientY <= (compTop + compHeight))) {
                                _this.closeSubLayer();
                            }
                        }
                    );
                }

                if (this.editmode && this.viewArr.length > 0) {
                    this.setItemTable();
                    this.itemTable.setSelectedIndex(0);
                } else if (this.itemArr != null && this.itemArr.length > 0) {
                    this.setItemTable();
                } else {
                    this.itemTable.hide();
                    if (this.itemTable.mainTable != null && this.itemTable.render.firstChild) {
                        this.setItemTable();
                    } else {
                        $l("this.itemTable.mainTable이 null입니다." + "[" + this.id + "]");
                    }
                }
            }
            this.isOpen = true;
            this.closeSubLayer();
        }
    } catch (e) {
        WebSquare.exception.printStackTrace(e, null, this);
    }
};

WebSquare.uiplugin.itemTable.prototype.findItemStartedWithKeyChar = function(e, code) {
    ["WebSquare.uiplugin.itemTable.findItemStartedWithKeyChar"];
    try {
        if (this.options.useFindItemFirstKeyChar === false) {
            return;
        }
        var findKeyValue = this.keyCharHash[code];
        var findIndex = -1;

        if (findKeyValue) {
            var index = this.selectedCell ? this.selectedCell.index : -1;
            if (this.options.findItem) {
                index = 0;
            }
            if (typeof index == "undefined" && this.selectedCell && !this._getCellDisabled()) {
                index = this.selectedCell.getAttribute("index");
            }
            var findKorValue = this.korCharHash[code];
            var findKorValue2 = this.korCharHash2[code];
            
            var counter = 1;
            if (this.options.findItem) {
                this._keyBuffer += findKeyValue;
            } else {
                this._keyBuffer = findKeyValue;
                index++;
            }
            while (1) {
                index = index % this.dom.tds.length;

                //hidden 처리
                if (this.dom.tds[index].style.display === "none") {
                    index++;
                    continue;
                }

                if (index == 0 && (this.options.chooseOption === true || this.options.allOption === true)) {
                    if (this.dom.tds.length <= 1) {
                        break;
                    } else {
                        index++;
                        continue;
                    }
                } 
                if ((index == 0 || index == 1) && (this.options.chooseOption === true && this.options.allOption === true)) {
                    if (this.dom.tds.length <= 2) {
                        break;
                    } else {
                        index++;
                        continue;
                    }
                }
                var labelLowerCase = this.dom.tds[index].innerHTML.toLowerCase();
                var korFindFlag = false;
                if (findKorValue && !e.shiftKey) {
                    korFindFlag = this.myhelper.startWith(labelLowerCase, findKorValue);
                } else if (findKorValue2 && e.shiftKey) {
                    korFindFlag = this.myhelper.startWith(labelLowerCase, findKorValue2);
                }
                var compareStr = this.options.findItem ? this._keyBuffer : findKeyValue;
                if (labelLowerCase.startsWith(compareStr) || (korFindFlag && WebSquare.util.getBoolean(this.options.findItemKor))) {
                    findIndex = index;
                    break;
                } else {
                    if (labelLowerCase.startsWith(compareStr)) {
                        this._keyBuffer = "";
                        findIndex = index;
                        break;
                    }
                }
                if (counter > this.dom.tds.length) {
                    break;
                }
                index++;
                counter++;
            }

            if (findIndex > -1) {
                this.setSelectedIndex(findIndex);
            } else {
                this._keyBuffer = "";
            }
        }
    } catch (ex) {
        WebSquare.exception.printStackTrace(ex);
    }
};