$(function () {
  const client = ZAFClient.init();
  client.invoke("resize", { width: "100%", height: "160px" });

  client.get("ticket.requester.id").then(function (data) {
    const user_id = data["ticket.requester.id"];
    requestUserInfo(client, user_id);
  });
});

function requestUserInfo(client, id) {
  const settings = {
    url: "/api/v2/users/" + id + ".json",
    type: "GET",
    dataType: "json",
  };

  console.log(settings);

  client.request(settings).then(
    function (data) {
      showInfo(data);
    },
    function (response) {
      showError(response);
    }
  );
}

function showInfo(data) {
  console.log(data);
  const requester_data = {
    name: data.user.name,
    tags: data.user.tags,
    email: data.user.email,
    timezone: data.user.time_zone,
    created_at: formatDate(data.user.created_at),
    updated_at: formatDate(data.user.updated_at),
  };

  const source = $("#requester-template").html();
  const template = Handlebars.compile(source);
  const html = template(requester_data);
  $("#content").html(html);
}

function showError(response) {
  const error_data = {
    status: response.status,
    statusText: response.statusText,
  };
  const source = $("#error-template").html();
  const template = Handlebars.compile(source);
  const html = template(error_data);
  $("#content").html(html);
}

function formatDate(date) {
  const cdate = new Date(date);
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  date = cdate.toLocaleDateString("pt-BR", options);
  return date;
}
