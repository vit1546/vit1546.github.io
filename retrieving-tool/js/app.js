var CLIENT_ID = '139358903198-fhc7jjp1l01i6serlqpjql6in0psmnc7.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

var agentReportApp = new Vue({
    el:"#agent-vue-app",
    data:{
        reports:null,
        agents:null,
        selectedAgent: "",
        reportRange:{
            type: "7",
            fromTs: Math.floor(new Date().getTime() / 1000) - 7 * 24 * 3600,
            toTs: Math.floor(new Date().getTime() / 1000),
            from: new Date(new Date().getTime() - 7 * 24 * 3600 * 1000).toISOString().replace(/t[^z]+z/i,""),
            to: new Date().toISOString().replace(/t[^z]+z/i,"")
        },
        result:{
            badTickets:{
                product:0,
                agentService:0,
                userError:0,
                total:0
            },
            comments:[],
            totalComments:0,
            commonMistakes:[],
            wellDoneCount:0,
            total:0
        }
    },

    methods:{
        getAgents: function (reports) {
            var users = [];

            for(var i = 0; i < reports.length; i++){
                if(users.indexOf(reports[i][1]) == -1){
                    users.push(reports[i][1]);
                }
            }

            return users.sort();
        },

        buildReport: function(){

            var from = this.reportRange.fromTs;
            var to = this.reportRange.toTs;

            var agent = this.selectedAgent;

            var ticketsInRange = this.getDataForRange(this.reports, from, to);

            var agentTickets = this.filterByProperty(ticketsInRange, 1, agent);

            var agentsBadTicketsProduct = 0;
            var agentsBadTicketsAgent = 0;
            var agentsBadTicketsUser = 0;
            var wellDoneCount = 0;

            for(var i = 0; i < agentTickets.length; i++){
                if(agentTickets[i][5] == "Bad"){
                    if(agentTickets[i][6] == "Product"){
                        agentsBadTicketsProduct++;
                    }else if(agentTickets[i][6] == "User error"){
                        agentsBadTicketsUser++;
                    }else if(agentTickets[i][6] == "User error"){
                        agentsBadTicketsUser++;
                    }
                }else if(agentTickets[i][5] == "None"){
                    if(agentTickets[i][8] == "Well Done"){
                        wellDoneCount++;
                    }
                }
            }

            this.result.badTickets.product = agentsBadTicketsProduct;
            this.result.badTickets.agentService = agentsBadTicketsAgent;
            this.result.badTickets.userError = agentsBadTicketsUser;
            this.result.badTickets.total = agentsBadTicketsProduct + agentsBadTicketsUser + agentsBadTicketsAgent;

            this.result.wellDoneCount = wellDoneCount;

            this.result.total = agentTickets.length;

            this.result.commonMistakes = this.getCommonMistakes(
                this.filterByProperty(
                    this.filterByProperty(agentTickets,5,"Bad"),
                    6,"Agent's Service").concat(this.filterByProperty(agentTickets,5,"None")));

            this.result.comments = this.getReportsWithComments(agentTickets);
            this.result.totalComments = this.result.comments.length;
        },

        getDataForRange: function (arr, from, to) {
            return arr.filter(function(v){
                return v[3] >= from && v[3] <= to
            })
        },

        filterByProperty: function (arr, index, property) {
            return arr.filter(function (v) {
                return v[index] == property
            })
        },

        getCommonMistakes: function (reviews) {
            var commonMistakes = [];

            var allMistakes = "";

            for(var i = 0; i < reviews.length; i++){
                if(reviews[i][7]){
                    allMistakes += reviews[i][7] + ",";
                }
                if(reviews[i][8]){
                    allMistakes += reviews[i][8]  + ",";
                }
            }
            allMistakes = allMistakes.split(",");
            allMistakes.splice(allMistakes.length - 1);

            while(allMistakes.length != 0){
                if(allMistakes[0].toLowerCase() == "well done"){
                    allMistakes.splice(0,1);
                    continue;
                }
                var value = allMistakes[0];
                var count = 0;
                for(var i = 0; i < allMistakes.length; i++){
                    if(allMistakes[i] == value){
                        count++;
                        allMistakes.splice(i,1);
                        i--;
                    }
                }
                commonMistakes.push({
                    mistake:value,
                    count:count
                });
            }

            return commonMistakes.sort(function(a,b){
                if(a.count > b.count){
                    return -1;
                }else if(a.count < b.count){
                    return 1;
                }else{
                    return 0;
                }
            });
        },

        getReportsWithComments: function(arr){

            var commentedReports = arr.filter(function (e) {
                return !!e[9]
            })

            var result = [];

            for(var i = 0; i < commentedReports.length; i++){
                result.push({
                    ticketId: commentedReports[i][0],
                    comment: commentedReports[i][9]
                })
            }

            return result;
        }
    },

    watch:{
        "reports": function (reports) {
            this.agents = this.getAgents(reports);
        },

        "reportRange.type": function (data) {
            var range = this.reportRange;

            if(data == "7"){
                range.from = new Date(new Date().getTime() - 7 * 24 * 3600 * 1000).toISOString().replace(/t[^z]+z/i,"");
                range.to = new Date().toISOString().replace(/t[^z]+z/i,"");
            }else if(data == "30"){
                range.from = new Date(new Date().getTime() - 30 * 24 * 3600 * 1000).toISOString().replace(/t[^z]+z/i,"");
                range.to = new Date(range.toTs * 1000).toISOString().replace(/t[^z]+z/i,"");
            }else{
                range.from = null;
                range.to = null;
            }
        },

        "reportRange.from": function (data) {
            this.reportRange.fromTs = Math.floor(new Date(data ? data : new Date().getTime()).getTime() / 1000);
        },

        "reportRange.to": function (data) {
            this.reportRange.toTs = Math.floor(new Date(data ? data : new Date().getTime()).getTime() / 1000);
        },

        "reportRange.fromTs":function (data) {
            this.buildReport()
        },

        "reportRange.toTs": function (data) {
            this.buildReport()
        },

        "selectedAgent": function (data) {
            this.buildReport()
        }
    }    
});

var reviewerReportApp = new Vue({
    el:"#reviewer-vue-app",
    data:{
        reports: null,
        reviewer: "",
        reviewers: null,
        result:{
            totalTime:0,
            totalReviews:0,
            averageTimePerReview:0,
            reviewsByAgents:[]
        },
        reportRange:{
            type: "7",
            fromTs: Math.floor(new Date().getTime() / 1000) - 7 * 24 * 3600,
            toTs: Math.floor(new Date().getTime() / 1000),
            from: new Date(new Date().getTime() - 7 * 24 * 3600 * 1000).toISOString().replace(/t[^z]+z/i,""),
            to: new Date().toISOString().replace(/t[^z]+z/i,"")
        }
    },

    methods:{

        buildReport: function () {
            var reviewersReports = this.filterByProperty(
                this.getDataForRange(this.reports, this.reportRange.fromTs,this.reportRange.toTs), 2, this.reviewer);
            var totalReviews = reviewersReports.length;
            var totalTime = this.getTotalTime(reviewersReports);
            var averageTimePerReview = totalTime / totalReviews;

            this.result.totalReviews = totalReviews;
            this.result.averageTimePerReview = this.formatSeconds(averageTimePerReview);
            this.result.totalTime = this.formatSeconds(totalTime);
            this.result.reviewsByAgents = this.getDataByAgents(reviewersReports);
        },

        getDataByAgents: function (reviews) {
            var result = [];
            for(var i = 0; i < reviews.length; i++){

                var reviewItem = result.find(function (v) {
                    return v.agent == reviews[i][1];
                });
                if(reviewItem){
                    reviewItem.time += parseInt(reviews[i][4]);
                    reviewItem.count++;
                }else{
                    result.push({
                        agent: reviews[i][1],
                        time: parseInt(reviews[i][4]),
                        count: 1
                    });
                }
            }

            result = result.map(function (v) {

                return{
                    agent: v.agent,
                    time: this.formatSeconds(v.time),
                    averageTime: this.formatSeconds(v.time / v.count),
                    count: v.count
                }
            }, this)

            return result.sort(function(a,b){
                if(a.count > b.count){
                    return -1;
                }else if(a.count < b.count){
                    return 1;
                }else{
                    return 0;
                }
            });
        },

        getReviewers: function (reports) {
            var users = [];

            for(var i = 0; i < reports.length; i++){
                if(users.indexOf(reports[i][2]) == -1){
                    users.push(reports[i][2]);
                }
            }

            return users.sort();
        },

        getTotalTime: function(tickets){
            var total = 0;

            for(var i = 0; i < tickets.length; i++){
                total += +tickets[i][4];
            }

            return total;
        },

        formatSeconds: function(time){

            var seconds = parseInt(time);

            var hours = Math.floor(seconds / 3600);
            var minutes = Math.floor((seconds - hours * 3600) / 60);
            var remainingSeconds = seconds - hours * 3600 - minutes * 60;

            return "%h:%m:%s"
                .replace("%h",("0" + hours).slice(-2))
                .replace("%m",("0" + minutes).slice(-2))
                .replace("%s",("0" + remainingSeconds).slice(-2));
        },

        getDataForRange: function (arr, from, to) {
            return arr.filter(function(v){
                return v[3] >= from && v[3] <= to
            })
        },

        filterByProperty: function (arr, index, property) {
            return arr.filter(function (v) {
                return v[index] == property
            })
        }
    },

    watch:{
        "reports": function(data){
            this.reviewers = this.getReviewers(data);
        },

        "reportRange.type": function (data) {
            var range = this.reportRange;

            if(data == "7"){
                range.from = new Date(new Date().getTime() - 7 * 24 * 3600 * 1000).toISOString().replace(/t[^z]+z/i,"");
                range.to = new Date().toISOString().replace(/t[^z]+z/i,"");
            }else if(data == "30"){
                range.from = new Date(new Date().getTime() - 30 * 24 * 3600 * 1000).toISOString().replace(/t[^z]+z/i,"");
                range.to = new Date(range.toTs * 1000).toISOString().replace(/t[^z]+z/i,"");
            }else{
                range.from = null;
                range.to = null;
            }
        },

        "reportRange.from": function (data) {
            this.reportRange.fromTs = Math.floor(new Date(data ? data : new Date().getTime()).getTime() / 1000);
        },

        "reportRange.to": function (data) {
            this.reportRange.toTs = Math.floor(new Date(data ? data : new Date().getTime()).getTime() / 1000);
        },

        "reportRange.fromTs":function (data) {
            this.buildReport()
        },

        "reportRange.toTs": function (data) {
            this.buildReport()
        },

        "reviewer": function (data) {
            this.buildReport()
        }
    }
});

function checkAuth() {

    document.getElementById('main-loader').style.display = "block";

    gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
    }, handleAuthResult);
}

function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    var loaderDiv = document.getElementById('main-loader');

    if (authResult && !authResult.error) {
        authorizeDiv.style.display = 'none';
        loadSheetsApi();
    } else {
        loaderDiv.style.display = "none";
        authorizeDiv.style.display = 'block';
    }
}

function handleAuthClick(event) {
    gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
        handleAuthResult);
    return false;
}

function loadSheetsApi() {
    var discoveryUrl =
        'https://sheets.googleapis.com/$discovery/rest?version=v4';
    gapi.client.load(discoveryUrl).then(getData);
}

function getData(){

    var loaderDiv = document.getElementById('main-loader');
    var appDiv = document.getElementById("main-wrap");

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1WkUBrxMlHHwdQhVR53G7A2v3CsMUG4xMJ7KxM8tCYZU',
        range: 'email!A2:J',
    }).then(function(response){
        loaderDiv.style.display = "none";
        appDiv.style.display = "block";
        initializeApp(response.result.values);
    });
}

function initializeApp(data){
    agentReportApp.reports = data;
    reviewerReportApp.reports = data;
}