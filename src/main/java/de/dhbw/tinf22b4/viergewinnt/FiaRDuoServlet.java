package de.dhbw.tinf22b4.viergewinnt;

import de.dhbw.tinf22b4.viergewinnt.beans.SpielbrettBean;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet(name = "spielservlet", value = "/four-in-a-row")
public class FiaRDuoServlet extends HttpServlet {
    private Map<String, SpielbrettBean> sessionSpielbrett;

    @Override
    public void init() {
        sessionSpielbrett = new HashMap<>();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String sessionId = request.getSession().getId();
        SpielbrettBean spielbrett = sessionSpielbrett.get(sessionId);
        if(spielbrett == null) {
            spielbrett = new SpielbrettBean();
            sessionSpielbrett.put(sessionId,spielbrett);
            System.out.println("Created Spielbrett for Session " + sessionId);
        }

        if(request.getParameter("column")!=null) {
            // Benutzereingaben verarbeiten
            int column = Integer.parseInt(request.getParameter("column"));

            // Spielstein setzen und Spielzustand überprüfen
            if (spielbrett.setStone(column)) {
                // Gewinner ermittelt
                if (!spielbrett.checkWin() && !spielbrett.checkDraw())
                    // Zum nächsten Spieler wechseln
                    spielbrett.switchPlayer();

            }
        }

        if(request.getParameter("reset")!=null)
            spielbrett.reset();

        if(request.getParameter("resetScore")!=null)
            spielbrett.resetScore();

        // Aktuellen Spielzustand an JSP-Seite übergeben
        request.setAttribute("spielbrett", spielbrett);
        request.getRequestDispatcher("FourInARow.jsp").forward(request, response);
    }
}