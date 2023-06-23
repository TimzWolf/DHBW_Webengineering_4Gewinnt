<%@ page import="de.dhbw.tinf22b4.viergewinnt.beans.SpielbrettBean" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Vier gewinnt</title>
    <style>
        /* CSS-Styling für das Spielbrett */
        table {
            border-collapse: collapse;
        }

        td {
            width: 50px;
            height: 50px;
            border: 1px solid black;
            text-align: center;
            font-weight: bold;
        }

        .player1 {
            background-color: yellow;
        }

        .player2 {
            background-color: red;
        }
    </style>
</head>
<body>
<h1>Vier gewinnt</h1>
<% if (request.getAttribute("winner") != null) { %>
<h2>Der Gewinner ist: <%= request.getAttribute("winner") %><br><a href="?reset">Neues Spiel</a></h2>
<% } %>
<table>
    <% SpielbrettBean spielbrett = (SpielbrettBean) request.getAttribute("spielbrett"); %>
    <% int[][] board = spielbrett.getBoard(); %>
    <% for (int i = 0; i < board.length; i++) { %>
    <tr>
        <% for (int j = 0; j < board[i].length; j++) { %>
        <td class="<%= (board[i][j] == 1) ? "player1" : (board[i][j] == 2) ? "player2" : "" %>">
            <%-- Das Feld ist leer oder enthält einen Spielstein eines Spielers --%>
            <% if (board[i][j] == 0) { %>
            <a href="?column=<%= j %>">+</a>
            <% } else { %>
            <%= (board[i][j] == 1) ? "X" : "O" %>
            <% } %>
        </td>
        <% } %>
    </tr>
    <% } %>
</table>
</body>
</html>