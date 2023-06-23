package de.dhbw.tinf22b4.viergewinnt;

import de.dhbw.tinf22b4.viergewinnt.beans.SpielbrettBean;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

@WebServlet(name = "spielservlet", value = "/")
public class SpielServlet extends HttpServlet {
    private SpielbrettBean spielbrett;

    @Override
    public void init() {
        spielbrett = new SpielbrettBean();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        if(request.getParameter("column")!=null) {
            // Benutzereingaben verarbeiten
            int column = Integer.parseInt(request.getParameter("column"));

            // Spielstein setzen und Spielzustand überprüfen
            if (spielbrett.setStone(column)) {
                if (spielbrett.checkWin()) {
                    // Gewinner ermittelt
                    String winner = (spielbrett.getCurrentPlayer() == 1) ? "Spieler 1" : "Spieler 2";
                    request.setAttribute("winner", winner);
                } else
                    // Zum nächsten Spieler wechseln
                    spielbrett.switchPlayer();
            }
        }

        if(request.getParameter("reset")!=null)
            spielbrett.reset();

        // Aktuellen Spielzustand an JSP-Seite übergeben
        request.setAttribute("spielbrett", spielbrett);
        request.getRequestDispatcher("spiel.jsp").forward(request, response);
    }
}