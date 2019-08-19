$(document).ready(function () {
  $('#application').dropdown()
  $('#notifications').dropdown()

  // Get Application List
  $('#application').on('change', function () {
    const selectedApplicationAWS = $('#application option:selected').data('aws')
    const selectedApplicationComposer = $('#application option:selected').data('composer')
    const selectedApplicationServers = $('#application option:selected').data('servers')
    var serverFQDN = ''

    var selectedServersNames = []
    var selectedServersIds = []

    const composer = selectedApplicationComposer
    const aws = selectedApplicationAWS

    // Clear existing servers
    $('#servers').empty()

    // Get Servers for Application
    var serverTypeClass = ''
    var loginpath = ''
    _.each(selectedApplicationServers, function (server, id) {
      switch(server.type) {
        case "web":
          serverTypeClass = " message web"
          loginpath = ''
          break
        case "db":
          serverTypeClass = " message db"
          loginpath = server.loginpath == '' ? 'local' : server.loginpath 
          break;
        default:
          serverTypeClass = ""
      }
      
      if (server.name != null) {
        $('#servers').append(
          '<div data-value="' + server.environment + '" class="ui">' +
            '<div id="' + id + '" class="ui slider checkbox' + serverTypeClass + '">' + 
              '<input type="checkbox" id="server' + id + '" name="' + server.fqdn + '" value="' + server.name + '" data-loginpath="' + loginpath + '" style="top: 13px; left: 19px;">' + 
              '<label>' + server.name + '</label>' + 
              '<span class="ui pointing label">' + server.fqdn + '</span>' + 
            '</div>'+
            '<br>' +
          '</div>')
        serverFQDN += server.fqdn + ', '
      } else {
        $('#servers').append('<div>No Servers Assigned To This Application.</div>')
      }
    })

    // Select production or staging
    var productionRoll = $('#production_roll')
    var stagingRoll = $('#staging_roll')
    var prodServers = $('#serversDiv').find('[data-value="prod"]')
    var stagingServers = $('#serversDiv').find('[data-value="stag"]')
    var loginpath = ''
    
    productionRoll.click(function (event) {
      event.preventDefault()
      productionRoll.addClass('green')
      stagingRoll.removeClass('red')
      prodServers.css('display', '')
      stagingServers.css('display', 'none')
      serverType = productionRoll.val()

      _.each(stagingServers.find('input[type=checkbox]'), function (server) {
        if(server.checked === true) {
            server.checked = false
            $('#selectedServersArray').val('')
        }
      }) 
    })

    stagingRoll.click(function (event) {
      event.preventDefault()
      stagingRoll.addClass('red')
      productionRoll.removeClass('green')      
      prodServers.css('display', 'none')
      stagingServers.css('display', '')
      serverType = stagingRoll.val()

      _.each(prodServers.find('input[type=checkbox]'), function (server) {
        if(server.checked === true) {
            server.checked = false
            $('#selectedServersArray').val('')
        }
      }) 
    })

    // Default to production environment
    productionRoll.trigger("click")

    // Add selected servers to a list
    $('#servers').delegate('input[type="checkbox"]', 'change', function () {
      if ($(this).prop('checked')) {
        selectedServersNames[$(this).attr('name')] = $(this).val()
        selectedServerLoginPath = $(this).data("loginpath")
      } else {
        delete selectedServersNames[$(this).attr('name')]
        selectedServerLoginPath = ''
      }

      var selectedServersArrayKeys = Object.keys(selectedServersNames)
      $('#selectedServersArray').val(selectedServersArrayKeys.join(','))

      // Check AWS
      var selectedServers = $('#selectedServersArray').val()
      if (selectedServers.indexOf('azw') >= 0) {
        $('#aws').prop('checked', true)
      } else {
        $('#aws').prop('checked', false)
      }
    })

    // Composer
    if (composer === 1) {
      $('#composer').prop('checked', true)
    } else {
      $('#composer').prop('checked', false)
    }

    // Check AWS
    if (aws === 1 || serverFQDN.indexOf('azw') >= 0) {
      $('#aws').prop('checked', true)
    } else {
      $('#aws').prop('checked', false)
    }
  })

  // Add release manager to notification list
  if($('#sendToReleaseManager').prop('checked')) {
    $('.ui.fluid.dropdown').dropdown('set selected',[$('#sendToReleaseManager').val()])
    $('#notificationsArray').val($('#notificationsArray').val() + $('#sendToReleaseManager').val() + ',')
  }
  $('#sendToReleaseManager').click(function () {
    if($('#sendToReleaseManager').prop('checked')) {
      $('.ui.fluid.dropdown').dropdown('set selected',[$('#sendToReleaseManager').val()])
    } else {
      $('.ui.fluid.dropdown').dropdown('remove selected',[$('#sendToReleaseManager').val()])
    }
  })

  // Notifications
  $('#notifications').on('change', function () {
    $('#notificationsArray').val($(this).val())
  })

  // Roll Type
  var webRoll = $('#web_roll')
  var dbRoll = $('#db_roll')
  var informaticaRoll = $('#informatica_roll')
  var jenkinsRoll = $('#jenkins_roll')
  var jaspersoftRoll = $('#jaspersoft_roll')
  var prUrlDiv = $('#prUrlDiv')
  var prUrl = $('#prUrl')
  var repoDiv = $('#repoDiv')
  var repo = $('#repo')
  var branchDiv = $('#branchDiv')
  var branch = $('#branch')
  var deploymentTypeDiv = $('#deploymentTypeDiv')
  var deploymentType = $('#deploymentType')

  $('#fileListLabel').html('Changed File List')

  webRoll.click(function (event) {
    var self = this

    event.preventDefault()
    webRoll.addClass('blue')
    dbRoll.removeClass('orange')
    informaticaRoll.removeClass('purple')
    jenkinsRoll.removeClass('green')
    jaspersoftRoll.removeClass('pink')
    $('#rollTypeValue').val(self.value)

    var allWebServers = $("div.ui.slider.checkbox.message.web")
    var allDBServers = $("div.ui.slider.checkbox.message.db")
    _.each(allWebServers, function (item) {
      $('#' + item.id).addClass('blue')
    })
    _.each(allDBServers, function (item) {
      $('#' + item.id).removeClass('orange')
    })

    prUrlDiv.css('display', 'none')
    $('#instructionsPreviewTitle').html('Roll Instructions:')
    $('#fileListPreviewTitle').html('Changed File List:')
    $('#composer').prop('checked', true)
    $('#composerDiv').css('display', '')

    $('#fileListDiv').css('display', 'block')
    $('#fileListLabel').html('Changed File List')

    repoDiv.css('display', '')
    repo.prop('disabled', false)
    branchDiv.css('display', '')
    branch.prop('disabled', false)
  })
  dbRoll.click(function (event) {
    var self = this

    event.preventDefault()
    dbRoll.addClass('orange')
    webRoll.removeClass('blue')
    informaticaRoll.removeClass('purple')
    jenkinsRoll.removeClass('green')
    jaspersoftRoll.removeClass('pink')
    $('#rollTypeValue').val(self.value)

    var allWebServers = $("div.ui.slider.checkbox.message.web")
    var allDBServers = $("div.ui.slider.checkbox.message.db")
    _.each(allDBServers, function (item) {
      $('#' + item.id).addClass('orange')
    })
    _.each(allWebServers, function (item) {
      $('#' + item.id).removeClass('blue')
    })

    prUrlDiv.css('display', 'none')
    $('#instructionsPreviewTitle').html('Roll Instructions:')
    $('#fileListPreviewTitle').html('Changed File List:')
    $('#composer').prop('checked', false)
    $('#composerDiv').css('display', 'none')
    
    $('#fileListDiv').css('display', 'block') 
    $('#fileListLabel').html('Changed File List')

    repoDiv.css('display', '')
    repo.prop('disabled', false)
    branchDiv.css('display', '')
    branch.prop('disabled', false)
  })
  informaticaRoll.click(function (event) {
    var self = this

    event.preventDefault()
    informaticaRoll.addClass('purple')
    webRoll.removeClass('blue')
    dbRoll.removeClass('orange')
    jenkinsRoll.removeClass('green')
    jaspersoftRoll.removeClass('pink')
    $('#rollTypeValue').val(self.value)

    var allServers = $("p.ui.slider.checkbox.message")
    _.each(allServers, function (item) {
      $('#' + item.id).removeClass('blue')
      $('#' + item.id).removeClass('orange')
    })

    prUrlDiv.css('display', 'none')
    $('#instructionsPreviewTitle').html('Roll Instructions:')
    $('#fileListPreviewTitle').html('Changed File List:')
    $('#composer').prop('checked', false)
    $('#composerDiv').css('display', 'none')

    $('#fileListDiv').css('display', 'none')          
    
    repoDiv.css('display', '')
    repo.prop('disabled', false)
    branchDiv.css('display', '')
    branch.prop('disabled', false)
  })
  jenkinsRoll.click(function (event) {
    var self = this

    event.preventDefault()
    jenkinsRoll.addClass('green')
    webRoll.removeClass('blue')
    dbRoll.removeClass('orange')
    informaticaRoll.removeClass('purple')
    jaspersoftRoll.removeClass('pink')
    $('#rollTypeValue').val(self.value)

    var allServers = $("p.ui.slider.checkbox.message")
    _.each(allServers, function (item) {
      $('#' + item.id).removeClass('blue')
      $('#' + item.id).removeClass('orange')
    })

    prUrlDiv.css('display', '')
    $('#instructionsPreviewTitle').html('Pull Request URL:')
    $('#fileListPreviewTitle').html('Changed File List:')
    $('#composer').prop('checked', false)
    $('#composerDiv').css('display', 'none')

    prUrl.prop('disabled', false)

    $('#fileListDiv').css('display', 'block')
    $('#fileListLabel').html('Changed File List')

    repoDiv.css('display', 'none')
    repo.prop('disabled', true)
    branchDiv.css('display', 'none')
    branch.prop('disabled', true)
    deploymentTypeDiv.css('display', 'none')
    deploymentType.prop('disabled', true)
  })
  jaspersoftRoll.click(function (event) {
    var self = this

    event.preventDefault()
    jaspersoftRoll.addClass('pink')
    webRoll.removeClass('blue')
    dbRoll.removeClass('orange')
    informaticaRoll.removeClass('purple')
    jenkinsRoll.removeClass('green')
    $('#rollTypeValue').val(self.value)

    var allServers = $("p.ui.slider.checkbox.message")
    _.each(allServers, function (item) {
      $('#' + item.id).removeClass('blue')
      $('#' + item.id).removeClass('orange')
    })

    prUrlDiv.css('display', 'none')
    $('#instructionsPreviewTitle').html('Roll Instructions:')
    $('#fileListPreviewTitle').html('Report Name(s):')
    $('#composer').prop('checked', false)
    $('#composerDiv').css('display', 'none')

    $('#fileListDiv').css('display', 'block')
    $('#fileListLabel').html('Report Name(s)')

    repoDiv.css('display', 'none')
    repo.prop('disabled', true)
    branchDiv.css('display', 'none')
    branch.prop('disabled', true)
    deploymentTypeDiv.css('display', 'none')
    deploymentType.prop('disabled', true)
  })
  // Mantis Items
  $('#mantis').selectize({
    plugins: ['remove_button'],
    delimiter: ',',
    persist: false,
    create: function (input) {
      return {
        value: input,
        text: input
      }
    }
  })

  // Check for mantis item
  $('#mantis').change(function () {
    var mantisIssue = $('#mantis').val()
    var mantisIssueArray = mantisIssue.split(',')
    _.each(mantisIssueArray, function (issue) {
      var url = '/mantisExists/' + issue
      $.get(url, function (result) {
        if (result === false) {
          $('div').find('[data-value="' + issue + '"]').css({'background-color': '#E0B4B4', 'border': '1px solid #9F3A38', 'color': '#9F3A38'})
        }
        if (result === true) {
          $('div').find('[data-value="' + issue + '"]').css({'background-color': '#B1FAB1', 'border': '1px solid #209142', 'color': '#209142'})
        }
      })
    })
  })

  var message = $.trim($('#message').text())

  if (message !== '') {
    $('#message').css('display', '')
    $('#messageContent').html(message)
  }

  // Validation
  $('#first').form({
    inline: true,
    keyboardShortcuts: false,
    fields: {
      application: {
        identifier: 'application',
        rules: [
          {
            type: 'empty',
            prompt: 'Please select an application'
          }
        ]
      },
      selectedServersArray: {
        identifier: 'selectedServersArray',
        rules: [
          {
            type: 'empty',
            prompt: 'Please select at least one server'
          }
        ]
      },
      mantis: {
        identifier: 'mantis',
        rules: [
          {
            type: 'empty',
            prompt: 'Please insert at least one mantis issue id'
          }
        ]
      },
      rollTypeValue: {
        identifier: 'rollTypeValue',
        rules: [
          {
            type: 'empty',
            prompt: 'Please select a roll type'
          }
        ]
      },
      repo: {
        identifier: 'repo',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter a repository or directory'
          }
        ]
      },
      branch: {
        identifier: 'branch',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter a branch'
          }
        ]
      },
      prUrl: {
        identifier: 'prUrl',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter a Pull Request URL'
          }
        ]
      },
      notifications: {
        identifier: 'notifications',
        rules: [
          {
            type: 'empty',
            prompt: 'You must select at least one notification email'
          }
        ]
      }
    },
    onSuccess: function (e) {
      e.preventDefault()
      if ($('form').form('is valid')) {
        var selectedApplicationName = $('#application option:selected').text()
        var selectedApplicationServers = $('#selectedServersArray').val()
        var formattedApplicationServers = selectedApplicationServers.replace(/,/g, '<br>')
        var rollTypeVal = $('#rollTypeValue').val()
        var partVal = $('#part').val()
        var totalVal = $('#total').val()
        var prUrlVal = $('#prUrl').val() ? $('#prUrl').val() : ''
        var repoUrlVal = ($('#repo').val()) ? $('#repo').val() : ''
        var branch = $('#branch').val()
        var emergencyfix = $('#emergencyfix').prop('checked') ? '[Emergency Fix]' : ''
        var outage = $('#outage').val()
        var riskLevel = $('input[name=risk_level]:checked').val()
        var script = ''
        var option1 = ''
        var composerUpdate = $('#composer').prop('checked') ? true : false
        var composerCommand = ''
        var selectedNotifications = $('#notificationsArray').val()
        var releaseManager = $('#sendToReleaseManager').prop('checked') ? $('#sendToReleaseManager').val() : ''
        var formattedNotifications = ''

        var instructions = ''
        var manualInstructions = $('#manualInstructions').val()
        

        var fullIssueLine = ''
        var mantisIssueString = $('#mantis').val()
        var url = '/mantisSummary/' + mantisIssueString
        $.get(url, function (result) {
          _.each(result, function (issue) {
            fullIssueLine += issue.id + ' - ' + issue.summary + '\n'
          })
          $('#instructions_mantis').html(fullIssueLine)
        })

        if ($('#date').val() === '') {
          var today = new Date()
          var dd = today.getDate()
          var mm = today.getMonth() + 1

          var yyyy = today.getFullYear()
          if (dd < 10) {
            dd = '0' + dd
          }
          if (mm < 10) {
            mm = '0' + mm
          }
          var date = mm + '/' + dd + '/' + yyyy
        } else {
          date = $('#date').val()
        }

        if (rollTypeVal === 'Database') {
          script = 'production_database_deploy.sh'
          option1 = '-b ' + branch + ' -l ' + selectedServerLoginPath
        } else {
          script = 'production_code_refresher_cron.sh'
          option1 = '-b ' + branch
          console.log("Composer: " + composerUpdate)
          if (composerUpdate === true) {
            composerCommand = ' --composer'
          }
        }

        if (manualInstructions) {
          instructions = manualInstructions
        } else if (rollTypeVal === 'Jenkins') {
          instructions = "1. Approve and merge the following PR: " + prUrlVal
        } else if (rollTypeVal === 'Database') {
          instructions = "<div>" +
            "<pre>" +
              "ssh [SERVER]\n" +
              "sudo su -\n" +
              "cd /root/\n" +
              "git archive --remote=ssh://git@172.17.16.19:7999/pub/scripts HEAD: " + script + " | tar -x\n" +
              "cd /data/sites/" + repoUrlVal + "\n" +
              "git checkout master\n" +
              "git pull origin\n" +
              "git checkout " + branch + "\n" +
              "git status\n" +
              "# Result: On branch " + branch + "\n" +
              "git diff master --name-only\n" +
              "# The results should be the list of changed files and the contents.\n" +
              "# If they aren't, STOP AND CONTACT THE DEVELOPER\n" +
              "/root/" + script + " " + option1 +
            "</pre>" +          
          "</div>"
        } else if (rollTypeVal === 'Jaspersoft') {
          instructions = manualInstructions
        } else if (rollTypeVal === 'Informatica') {
          instructions = manualInstructions
          $('#fileListPreviewTitle').css('display', 'none')
          $('#instructions_fileList').css('display', 'none')
        } else {
          instructions = "<div>" +        
            "<pre>" +
              "ssh [SERVER]\n" +
              "sudo su -\n" +
              "cd /root/\n" +
              "git archive --remote=ssh://git@172.17.16.19:7999/pub/scripts HEAD: " + script + " | tar -x\n" +
              "cd /data/sites/" + repoUrlVal + "\n" +
              "git stash\n" +
              "/root/" + script + " " + option1 + composerCommand
            "</pre>" +          
          "</div>"
        }

        var fileList = $('#fileList').val()
        var previewFormattedFileList = fileList.replace(/\n/g, "<br>")
    
        formattedNotifications = selectedNotifications.replace(/,/g, '\n')
        $('#instructions_application').html(selectedApplicationName)
        $('#instructions_serverType').html(serverType)
        $('#instructions_date').html(date)
        $('#instructions_part').html(partVal)
        $('#instructions_ofpart').html(totalVal)
        $('#instructions_rollType').html($('#rollTypeValue').val())
        $('#instructions_instructions').html(instructions)
        $('#instructions_fileList').html(previewFormattedFileList)
        $('#instructions_server').html(formattedApplicationServers)
        $('#instructions_repo').html(repoUrlVal)
        $('#instructions_outage').html(outage)
        $('#instructions_emergencyfix').html(emergencyfix)
        $('#instructions_risk').html(riskLevel)
        $('#instructions_post').text($('#verification').val())
        $('#instructions_notifications').html(formattedNotifications)
        $('#instructions_recipients').val(selectedNotifications)
        $('#instructions_prUrl').html(prUrlVal)
        $('#instructions_prUrlVal').html(prUrlVal)
        $('#preview').modal('show')
        // $('.ui.modal').modal('show')
      }
    }
  })

  $('#login').form({
    inline: true,
    keyboardShortcuts: false,
    fields: {
      username: {
        identifier: 'username',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter a username'
          }
        ]
      },
      password: {
        identifier: 'password',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter a password'
          }
        ]
      }
    }
  })

  $('#sendInstructions').click(function (e) {
    e.preventDefault()
    var notificationsVal = $('#instructions_recipients').val()
    var content = $('#instructions_container').text()
    var applicationVal = $('#application').val()
    var partVal = $('#part').val()
    var totalVal = $('#total').val()
    var emailResult = $('#emailResult')

    // data is what the server sends back
    $.post('/email', {'instructions': content,
      'recipients': notificationsVal,
      'application': applicationVal,
      'part': partVal,
      'total': totalVal}, function (data) {
        if (data !== null &&
          typeof data !== 'object' &&
          data.indexOf('error')) {
            emailResult.css('display', '')
            emailResult.addClass('negative')
            emailResult.text('E-mail failed: \n' + data)
        } else {
          emailResult.css('display', '')
          emailResult.addClass('positive')
          emailResult.text('E-mailed instructions successfully \n' + 'Notification ID: ' + data.notification_id)
          window.open('/', '_self', false)
        }
    })
  })
})
