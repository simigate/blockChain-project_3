App = {

    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",
    bufferImage: null,
    init: async function () {

        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID,
            App.originFarmerID,
            App.originFarmName,
            App.originFarmInformation,
            App.originFarmLatitude,
            App.originFarmLongitude,
            App.productNotes,
            App.productPrice,
            App.distributorID,
            App.retailerID,
            App.consumerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function (err, res) {
            if (err) {
                console.log('Error:', err);
                return;
            }
            console.log('getMetaskID:', res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain = '../../build/contracts/SupplyChain.json';

        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function (data) {
            console.log('data', data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);

            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', App.handleButtonClick);
        $("input[type=file]").change(App.onChange);
    },
    onChange: async function (event) {
        //   App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processIdchange', processId);
        if (processId == 13) {
            return await App.getImage(event);
        }
    },

    handleButtonClick: async function (event) {
        //event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId', processId);

        switch (processId) {
            case 1:
                return await App.harvestItem(event);
                break;
            case 2:
                return await App.processItem(event);
                break;
            case 3:
                return await App.packItem(event);
                break;
            case 4:
                return await App.sellItem(event);
                break;
            case 5:
                return await App.buyItem(event);
                break;
            case 6:
                return await App.shipItem(event);
                break;
            case 7:
                return await App.receiveItem(event);
                break;
            case 8:
                return await App.purchaseItem(event);
                break;
            case 9:
                return await App.fetchItemBufferOne(event);
                break;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            case 11:
                return await App.upload(event);
                break;
            case 12:
                return await App.read(event);
                break;

        }
    },

    harvestItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.contracts.SupplyChain.deployed().then(function (instance) {
            instance.harvestItem(
                App.upc,
                App.metamaskAccountID,
                App.originFarmName,
                App.originFarmInformation,
                App.originFarmLatitude,
                App.originFarmLongitude,
                App.productNotes,
                { from: App.metamaskAccountID }
            );
        }).then(function (result) {
            $("#ftc-item").val("");
            console.log('harvestItem', result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    processItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.processItem(App.upc, { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").val("");
            console.log('processItem', result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    packItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.packItem(App.upc, { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").val("");
            console.log('packItem', result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    sellItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function (instance) {
            const productPrice = web3.utils.toWei("1", "ether");
            console.log('productPrice', productPrice);
            return instance.sellItem(App.upc, App.productPrice, { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").val("");
            console.log('sellItem', result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    buyItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function (instance) {
            const walletValue = web3.utils.toWei("3", "ether");
            return instance.buyItem(App.upc, { from: App.metamaskAccountID, value: walletValue });
        }).then(function (result) {
            $("#ftc-item").val("");
            console.log('buyItem', result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    shipItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.shipItem(App.upc, { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").val("");
            console.log('shipItem', result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    receiveItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.receiveItem(App.upc, { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").val("");
            console.log('receiveItem', result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    purchaseItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.purchaseItem(App.upc, { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").val("");
            console.log('purchaseItem', result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    fetchItemBufferOne: function () {
        ///   event.preventDefault();
        ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc', App.upc);

        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.fetchItemBufferOne.call(App.upc);
        }).then(function (result) {

            let itemSKU = BigNumber(result[0]).toString();
            let itemUPC = BigNumber(result[1]).toString();
            let ownerID = result[2];
            let originFarmerID = result[3];
            let originFarmName = result[4];
            let originFarmInformation = result[5];
            let originFarmLatitude = result[6];
            let originFarmLongitude = result[7];
            $('#ftc-item').val(
                'SKU : ' + itemSKU +
                '\nUPC : ' + itemUPC +
                '\nOwner ID : ' + ownerID +
                '\nOrigin Farmer ID : ' + originFarmerID +
                '\nOrigin Farmer Name : ' + originFarmName +
                '\nOrigin Farmer Information : ' + originFarmInformation +
                '\nOrigin Farmer Latitude : ' + originFarmLatitude +
                '\nOrigin Farmer Longitude : ' + originFarmLongitude);
            console.log('fetchItemBufferOne:',
                'SKU : ' + itemSKU,
                ',UPC : ' + itemUPC,
                ',ownerID : ' + ownerID,
                ',originFarmerID : ' + originFarmerID,
                ',originFarmName : ' + originFarmName,
                ',originFarmInformation : ' + originFarmInformation,
                ',originFarmLatitude : ' + originFarmLatitude,
                ',originFarmLongitude : ' + originFarmLongitude);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
        ///    event.preventDefault();
        ///    var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function (result) {
            let itemSKU = BigNumber(result[0]).toString();
            let itemUPC = BigNumber(result[1]).toString();
            let productID = BigNumber(result[2]).toString();
            let productNotes = result[3];
            let productPrice = BigNumber(result[4]).toString();
            let itemState = BigNumber(result[5]).toNumber();
            let state = "";
            switch (itemState) {
                case 0:
                    state = "Harvested"; // 0
                    break;
                case 1:
                    state = "Processed"; // 1
                    break;
                case 2:
                    state = "Packed"; // 2
                    break;
                case 3:
                    state = "ForSale"; // 3
                    break;
                case 4:
                    state = "Sold"; // 4
                    break;
                case 5:
                    state = "Shipped"; // 5
                    break;
                case 6:
                    state = "Received"; // 6
                    break;
                case 7:
                    state = "Purchased"; // 7
                    break;
            }
            let distributorID = result[6];
            let retailerID = result[7];
            let consumerID = result[8];
            $("#ftc-item").val(
                'SKU : ' + itemSKU +
                '\nUPC : ' + itemUPC +
                '\nProduct ID : ' + productID +
                '\nProduct Notes : ' + productNotes +
                '\nProduct Price : ' + productPrice +
                '\nItem State : ' + state +
                '\nDistributor ID : ' + distributorID +
                '\nRetailer ID : ' + retailerID +
                '\nConsumer ID : ' + consumerID);
            console.log('fetchItemBufferTwo :',
                'SKU : ' + itemSKU,
                ',UPC : ' + itemUPC,
                ',productID : ' + productID,
                ',productNotes : ' + productNotes,
                ',productPrice : ' + productPrice,
                ',itemState : ' + state,
                ',distributorID : ' + distributorID,
                ',retailerID : ' + retailerID,
                ',consumerID : ' + consumerID);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    upload: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        if (App.bufferImage) {

            const buff = buffer.Buffer(App.bufferImage);
            const ipfs = window.IpfsApi('/ip4/127.0.0.1/tcp/5001') // Connect to IPFS
            //const ipfs = window.IpfsApi({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // Connect to IPFS
            ipfs.files.add(buff, (error, result) => {
                if (error) {
                    console.log("ipfs" + error);
                }
                else {
                    App.contracts.SupplyChain.deployed().then(function (instance) {
                        console.log("uploadHash :" + result[0].hash); //hash returned from ipfs
                        var ipfshash = result[0].hash;
                        return instance.upload(ipfshash, { from: App.metamaskAccountID });
                    }).then(function (result) {
                        // $("#ftc-item").val(result);
                        console.log('upload', result);
                    }).catch(function (err) {
                        console.log(err.message);
                    });
                }
            })
        }
        else {
            alert("Choose an image to upload.");
        }
    },

    read: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.read({ from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-image").attr('src', "https://gateway.ipfs.io/ipfs/" + result); //ipfshash returned from read
            // $("#ftc-item").val(result);
            console.log('readhash :', result);
        }).catch(function (err) {
            console.log(err.message);
        });


    },
    getImage: function (event) {
        //event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        const file = event.target.files[0];
        if (file && file['type'].split('/')[0] === 'image') {
            var reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = function () {
                App.bufferImage = reader.result;
                // console.log("result" + App.bufferImage);
            };
        }
        else {
            App.bufferImage = null;
            //console.log("None" + App.bufferImage);
        }
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                    App.contracts.SupplyChain.currentProvider,
                    arguments
                );
            };
        }

        App.contracts.SupplyChain.deployed().then(function (instance) {
            var events = instance.allEvents(function (err, log) {
                if (!err)
                    $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
            });
        }).catch(function (err) {
            console.log(err.message);
        });

    }
};

$(function () {
    $(window).load(function () {

        App.init();
    });
});

