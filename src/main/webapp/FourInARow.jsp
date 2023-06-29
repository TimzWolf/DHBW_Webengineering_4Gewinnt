<%@ page import="de.dhbw.tinf22b4.viergewinnt.beans.SpielbrettBean" %>
<%@ page import="java.util.Calendar" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="de">
<head>
    <title>Vier Gewinnt</title>
    <link rel="stylesheet" type="text/css" href="mainStylesheet.css">
    <link rel="stylesheet" type="text/css" href="gameStylesheet.css">
    <link id="themeCSS" rel="stylesheet" type="text/css" href="darkStylesheet.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="FourInARow.js"></script>
</head>
<body>
<%
    SpielbrettBean spielbrett = (SpielbrettBean) request.getAttribute("spielbrett");
    int[][] board = spielbrett.getBoard();
%>
<!-- Game title -->
<div id="head">
    <h1>Vier Gewinnt</h1>
    <a href="index.jsp"><button class="Button" id="home"><img src="home.png"></button></a>
</div>

<!-- Player indicator -->
<div id="playerIndicator">
    <div class="playerCircle redCircle" <%= (spielbrett.isInGame() && spielbrett.getCurrentPlayer() == 1) ? "style=\"display: block\"" : "" %>></div>
    <div class="playerCircle yellowCircle" <%= (spielbrett.isInGame() && spielbrett.getCurrentPlayer() == 2) ? "style=\"display: block\"" : "" %>></div>
</div>
<!-- Game board -->
<div id="gameBoard">
    <!-- Points for red player -->
    <div class="points">
        <p>Punkte Rot</p>
        <p id="pointsRed"><%= spielbrett.getWins(1) %></p>
        <div id="winningAnimationRed" style="visibility: <%= spielbrett.getCurrentWinner() == 1 ? "visible" : "hidden" %>" class="win-animation">
            <img src="trophy.png" alt="Gewinner">
        </div>
    </div>
    <div id="board">
        <!-- Generate game board dynamically using JavaScript -->
        <% for (int i = 0; i < board.length; i++) { %>
        <div>
            <% for (int j = 0; j < board[i].length; j++) { %>
            <div <%= spielbrett.isInGame() && board[i][j] == 0 ? "onclick=\"window.location='?column="+j+"'\"" :"" %> class="<%= (board[i][j] == 1) ? "cell red" : (board[i][j] == 2) ? "cell yellow" : (board[i][j] == 3 && spielbrett.getCurrentWinner() == 1) ? "cell red winRed" : (board[i][j] == 3 && spielbrett.getCurrentWinner() == 2) ? "cell yellow winYellow" : "cell empty" %>"></div>
            <% } %>
        </div>
        <% } %>
    </div>
    <!-- Points for yellow player -->
    <div class="points">
        <p>Punkte Gelb</p>
        <p id="pointsYellow"><%= spielbrett.getWins(2) %></p>
        <div id="winningAnimationYellow" style="visibility: <%= spielbrett.getCurrentWinner() == 2 ? "visible" : "none" %>" class="win-animation">
            <img src="trophy.png" alt="Gewinner">
        </div>
    </div>
</div>
<!-- Game status -->
<div>
    <p id="status"><%=
        !spielbrett.isInGame() ?
            spielbrett.getCurrentWinner() == 0 ?
                    "Unentschieden!" :
                    (spielbrett.getCurrentWinner() == 1 ? "Rot" : "Gelb")
                    + " gewinnt!"
                : ""
    %></p>
</div>
<!-- Reset game button -->
<div>
    <button class="Button" <%= (spielbrett.isInGame()) ? "style=\"visibility:hidden\"" : "" %>><a href="?reset" style="text-decoration: none; color: white">Neues Spiel</a></button>
</div>
<!-- Theme switch button -->
<div id="ThemeButtonContainer">
    <button class="Button"><a href="?resetScore"><img src="scoreboard.png"></a></button>
    <button class="Button"><a href="?reset"><img src="undo.png"></a></button>
    <button class="Button" id="decreaseSize"><img src="minus.png"></button>
    <button class="Button" id="increaseSize"><img src="plus.png"></button>
    <button class="Button" id="themeSwitch"><img src="sun.png"></button>
</div>
</body>
<footer>
    <div>
        Copyright
        &copy;
        <%= Calendar.getInstance().get(Calendar.YEAR) %>, Vier-Gewinnt Spiel
    </div>
    <a id="impressum" href="impressum.jsp">Impressum</a>
</footer>
</html>
