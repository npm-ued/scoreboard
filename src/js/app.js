var Users,web3,userList=[];
var App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load users.
    //  $.getJSON("users.json", function(data) {
    //   var user_data = '';
      
    //   $.each(data, function(key, value){
    //     user_data += '<tr>';
    //     user_data += '<td>'+value.id+'</td>';
    //     user_data += '<td>'+value.name+'</td>';
    //     user_data += '<td>'+value.points+'</td>';
    //     user_data += '</tr>';
    //   });
    //   $('#user_table').append(user_data);
    // });

    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    App.getUsers();
    return App.initContract();
  },

   getUsers:function(){
    $.getJSON("users.json", function(data) {
        Users = data;
        Users = TruffleContract(Users);
        Users.setProvider(web3.currentProvider);
        Users.deployed().then(function(item){
            return item.getUsers();
        }).then(function(result){
        // console.log(result);
        if(result&&result.length){
            var ids=result[0],names=result[1],points=result[2];
            for(var i=0;i<ids.length;i++){
                var user = {id:ids[i],name:web3.toAscii(names[i]),points:points[i]};
                userList.push(user);
            }
            var user_data = '';
            $.each(userList, function(key, value){
                user_data += '<tr>';
                user_data += '<td>'+value.id+'</td>';
                user_data += '<td>'+value.name+'</td>';
                user_data += '<td>'+value.points+'</td>';
                user_data += '</tr>';
            });
            $('#user_table').append(user_data);
        }
      });
    });

  },

  initContract: function() {
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-addpoints', App.handlePoints);
    $(document).on('click','.btn-addgamer', App.givePoints);
  },

  handlePoints: function() {
    // event.preventDefault();
    var userId = parseInt($("#userId").val());
    Users.deployed().then(function(instance){
        // 修改需要提供一个用户
      return instance.plusFive(userId,{from: web3.eth.coinbase});
    }).then(function(result){
        console.log(result);
        if(result){
            alert("加分成功");

        }else{
            alert("加分失败");
        }
    });
    /*
     * Replace me...
     */
  },

  givePoints: function(id, amount) {
    event.preventDefault();
    Users.deployed().then(function(instance){
      return instance.addUser("name",10,{from: web3.eth.coinbase});
    }).then(function(result){
        console.log(result)
        if(result){
            alert("添加用户成功");
        }else{
            alert("添加用户失败");
        }
    });

    /*
     * Replace me...
     */

  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
