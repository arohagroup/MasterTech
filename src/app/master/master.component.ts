import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
  file: any;
  arrayBuffer: any;
  filelist: any[] = [];
  dataList: any[] = [];
  Models: any[] = [];
  FuelTypes: any[] = [];
  Kilometers: any[] = [];
  activeModel: any = 'Etios';
  activeFuel: any = 'Petrol';
  activeKM: any = '10000';
  filteredData: any[] = [];
  estimatedCostData: any[] = [];
  showTable: boolean = true;

  constructor() { }

  ngOnInit(): void {
    
  }

  addfile(event: any){    
  this.file = event.target.files[0]; 

  let fileReader = new FileReader();    
  fileReader.readAsArrayBuffer(this.file);     
  fileReader.onload = (e) => {    
      this.arrayBuffer = fileReader.result;    
      var data = new Uint8Array(this.arrayBuffer);    
      var arr = new Array();    
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
      var bstr = arr.join("");    
      var workbook = XLSX.read(bstr, {type:"binary"});    
      var first_sheet_name = workbook.SheetNames[1];    
      var worksheet = workbook.Sheets[first_sheet_name];    
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));    
        this.dataList = XLSX.utils.sheet_to_json(worksheet,{raw:true});
        
        /* list of element looks like this::
            Fuel: "Petrol"
            Gasket Engine Oil Drain Plug: 63
            KM: 10000
            Labour Amount: 0
            Model: "Etios"
            No.: 1
            Oil Filter: 343.5
            Parts Amount: 1690.2
            Total amount: 1690.2
            Toyota Oil: 1139.7
            Windshield washer fluid: 144
        */
            this.Models = [];
            this.FuelTypes = [];
            this.Kilometers = [];
              // Unique array
              this.Models = [...new Set(this.dataList.map(element => element['Model']))]
              this.FuelTypes = [...new Set(this.dataList.map(element => element['Fuel']))]
              this.Kilometers = [...new Set(this.dataList.map(element => element['KM']))]
        //     this.filelist = [];    
            console.log(this.Models)    
    
  }  

}

/* var headersList = Object.keys(this.data['DfSample'][0]);
      headersList.forEach((key) => {
        this.ColMap.push({
          header: key, field: key
        }); 
      });  */

      filterData(f: NgForm){
        // console.log(f.value);
        //{ model: 'Etios', fuel_type: 'Diesel', km: '600000'}
        var responseData: any[] = [];
        responseData.push(this.dataList.filter(element => element['Model'] == f.value['model'] &&  element['Fuel'] == f.value['fuel_type'] &&  element['KM'] == f.value['km']))
        // console.log(responseData)
        this.filteredData = [];
        this.estimatedCostData = [];
        Object.keys(responseData[0][0]).forEach(e => {
          if(e =='Parts Amount' || e == 'Labour Amount' || e == 'Total amount'){
            this.estimatedCostData.push(
              {
                'key' : e,
                'value' : responseData[0][0][e]
              });
            } else if(!(e == 'No.' || e == 'Fuel' || e == 'Model' || e == 'KM' || e == 'Parts Amount' || e == 'Labour Amount' || e == 'Total amount')) {
              this.filteredData.push({
                'key' : e,
                'value' : responseData[0][0][e]
              });
            }
          });
        // console.log(this.filteredData)
      }


      clear(f: NgForm){
        f.reset();
        this.filteredData = [];
        this.estimatedCostData = [];
        this.showTable = false;
        
      }

}
