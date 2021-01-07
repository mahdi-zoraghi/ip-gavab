class IP {
  constructor(
    ip,
    ipClass,
    ipScopeNet,
    ipScopeHost,
    ipNetId,
    indexPoints,
    ipHostId,
    ipNetAddress,
    ipBroadcast,
    ipSubnetMask
  ) {
    this.ip = ip;
    this.ipClass = ipClass;
    this.ipScopeNet = ipScopeNet;
    this.ipScopeHost = ipScopeHost;
    this.ipNetId = ipNetId;
    this.indexPoints = indexPoints;
    this.ipHostId = ipHostId;
    this.ipNetAddress = ipNetAddress;
    this.ipBroadcast = ipBroadcast;
    this.ipSubnetMask = ipSubnetMask;
  }

  validateIp() {
    let ip = $("#input").val();
    $("#input").val("");

    this.ip = ip;

    let ipt = this.ip.match(/[.]/g);

    if (this.ip != "" && ipt != null) {
      if (ipt.length != 3) {
        swal({
          icon: "error",
          // title: "تعداد نقطه های وارد شده بین اعداد باید 3 تا باشد",
          title: "ip not valid",
        });
      } else {
        let validateIpError = false;
        this.getIndexPoints();
        for (let i = 1; i < this.indexPoints.length; i++) {
          if (this.indexPoints[i] > 255) {
            validateIpError = true;
          }
        }
        if (validateIpError == true) {
          swal({
            icon: "info",
            // title: "عدد های وارد شده باید بین 0 تا 255 باشد",
            title: "Numbers must be between 0 and 255.",
          });
        } else {
          let indexPoint = this.ip.indexOf(".");
          let primeNumber = this.ip.slice(0, indexPoint);
          this.getClass(primeNumber);
          this.getNetId();
          this.getHostId();
          this.getNetAddress();
          this.getAddressBroadcast();
          this.getSubnetMask();
          this.render();
        }
      }
    } else {
      swal({
        icon: "error",
        // title: "لطفا یک آی پی را برای ورودی به سیستم دهید",
        title: "Please enter an IP.",
      });
    }
  }

  getIndexPoints() {
    this.indexPoints = this.ip.split(".");
  }

  getClass(prime) {
    let primeNumber = Number(prime);
    if (primeNumber == 0 || primeNumber == 127) {
      swal({
        icon: "info",
        title: "Loopback Address",
      });
    }
    if (primeNumber > 255) {
      swal({
        icon: "error",
        title: "IP NOT FOUNDED",
      });
    }
    if (primeNumber >= 1 && primeNumber <= 126) {
      this.ipClass = "A";
      this.ipScopeNet = 1;
      this.ipScopeHost = 3;
    }
    if (primeNumber >= 128 && primeNumber <= 191) {
      this.ipClass = "B";
      this.ipScopeNet = 2;
      this.ipScopeHost = 2;
    }
    if (primeNumber >= 192 && primeNumber <= 223) {
      this.ipClass = "C";
      this.ipScopeNet = 3;
      this.ipScopeHost = 1;
    }
    if (primeNumber >= 224 && primeNumber <= 239) {
      this.ipClass = "D";
      this.ipScopeNet = undefined;
      this.ipScopeHost = undefined;
    }
    if (primeNumber >= 240 && primeNumber <= 255) {
      this.ipClass = "E";
      this.ipScopeNet = undefined;
      this.ipScopeHost = undefined;
    }
  }

  getNetId() {
    let count = this.indexPoints;
    if (this.ipScopeNet == 1) {
      this.ipNetId = count[0];
    }
    if (this.ipScopeNet == 2) {
      this.ipNetId = count[0] + "." + count[1];
    }
    if (this.ipScopeNet == 3) {
      this.ipNetId = count[0] + "." + count[1] + "." + count[2];
    }
  }

  getHostId() {
    let count = this.indexPoints;
    if (this.ipScopeHost == 1) {
      this.ipHostId = count[3];
    }
    if (this.ipScopeHost == 2) {
      this.ipHostId = count[2] + "." + count[3];
    }
    if (this.ipScopeHost == 3) {
      this.ipHostId = count[1] + "." + count[2] + "." + count[3];
    }
  }

  getNetAddress() {
    let count = this.indexPoints;
    if (this.ipClass == "A") {
      this.ipNetAddress = count[0] + ".0.0.0";
    }
    if (this.ipClass == "B") {
      this.ipNetAddress = count[0] + "." + count[1] + ".0.0";
    }
    if (this.ipClass == "C") {
      this.ipNetAddress = count[0] + "." + count[1] + "." + count[2] + ".0";
    }
    if (this.ipClass == "D" || this.ipClass == "E") {
      this.ipNetAddress = undefined;
    }
  }

  getAddressBroadcast() {
    let count = this.indexPoints;
    if (this.ipClass == "A") {
      this.ipBroadcast = count[0] + ".255.255.255";
    }
    if (this.ipClass == "B") {
      this.ipBroadcast = count[0] + "." + count[1] + "." + "255.255";
    }
    if (this.ipClass == "C") {
      this.ipBroadcast = count[0] + "." + count[1] + "." + count[2] + ".255";
    }
    if (this.ipClass == "D" || this.ipClass == "E") {
      this.ipBroadcast = undefined;
    }
  }

  getSubnetMask() {
    if (this.ipClass == "A") {
      this.ipSubnetMask = "255.0.0.0";
    }
    if (this.ipClass == "B") {
      this.ipSubnetMask = "255.255.0.0";
    }
    if (this.ipClass == "C") {
      this.ipSubnetMask = "255.255.255.0";
    }
    if (this.ipClass == "D" || this.ipClass == "E") {
      this.ipSubnetMask = undefined;
    }
  }

  render() {
    $("#ip").text(this.ip);
    $("#class").text(this.ipClass || "undefined");
    $("#netId").text(this.ipNetId || "undefined");
    $("#hostId").text(this.ipHostId || "undefined");
    $("#netAd").text(this.ipNetAddress || "undefined");
    $("#brod").text(this.ipBroadcast || "undefined");
    $("#subnet").text(this.ipSubnetMask || "undefined");
  }
}

// //// call ->
$("#calculate").click((event) => {
  const ip = new IP().validateIp();
});

////// copy to clipboard
$(".copy").click((e) => {
  const copyElement = e.target.getAttribute("data-copy");
  const elementValue = document.getElementById(copyElement).innerText;

  //   create a input and copy and remove input
  const input = document.createElement("input");
  input.value = elementValue;
  e.target.appendChild(input);
  input.focus();
  input.select();
  input.setSelectionRange(0, 99999); /* For mobile devices */
  document.execCommand("copy");
  e.target.removeChild(input);
});
