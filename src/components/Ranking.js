import React, { useState, useEffect } from 'react';
import axios from 'axios';
import goldCrown from '../icons/goldCrown.svg';
import silverCrown from '../icons/silverCrown.svg';
import bronzeCrown from '../icons/bronzeCrown.svg';

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [victoryBarHeights, setVictoryBarHeights] = useState({});
  const [pixKey, setPixKey] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get('https://brawlhalla-championship-backend.onrender.com/users');
        const players = response.data;

        const sortedRanking = players.sort((a, b) => b.victorys - a.victorys);

        const lastSeasonChamp = sortedRanking[0];
        setPixKey(lastSeasonChamp?.pix_key || '');
        setRanking(players);
        setLoading(false);

      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  useEffect(() => {
    if (ranking.length > 0) {
      const maxVictories = Math.max(...ranking.map(player => player.victorys));
      const heights = ranking.reduce((acc, player) => {
        acc[player.id] = (player.victorys / maxVictories) * 27;
        return acc;
      }, {});
      setVictoryBarHeights(heights);
    }
  }, [ranking]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const sortedRanking = ranking.sort((a, b) => b.victorys - a.victorys);

  const topPlayers = sortedRanking.slice(0, 3);
  const leftPlayers = sortedRanking.slice(3, 6);
  const rightPlayers = sortedRanking.slice(6, 9);

  return (
    <div style={styles.container}>
      <div style={styles.fileira}>
        <div style={styles.sectionLeft}>
          {leftPlayers.map(player => (
            <div key={player.id} style={styles.player}>
              <img
                src={player.avatar_url}
                alt={player.name}
                style={styles.avatar}
              />
              <div style={styles.details}>
                <h2 style={styles.name}>{player.name}</h2>
                <p style={styles.victories}>{player.victorys} wins</p>
                <div style={{ ...styles.animationBar, height: `${victoryBarHeights[player.id] || 0}rem` }}></div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.sectionCenter}>
          {topPlayers.map((player, index) => {
            // Verifica se o jogador deve receber uma coroa
            const showCrown =
              (index === 0 && player.victorys > 0) ||
              (index === 1 && player.victorys > 0 && topPlayers[0].victorys > player.victorys) ||
              (index === 2 && player.victorys > 0 && topPlayers[1].victorys > player.victorys);

            return (
              <div key={player.id} style={styles.player}>
                {showCrown && index === 0 && <img src={goldCrown} alt="Coroa de Ouro" style={styles.crownGold} />}
                {showCrown && index === 1 && <img src={silverCrown} alt="Coroa de Prata" style={styles.crownSilver} />}
                {showCrown && index === 2 && <img src={bronzeCrown} alt="Coroa de Bronze" style={styles.crownBronze} />}
                <img
                  src={player.avatar_url}
                  alt={player.name}
                  style={styles.avatar}
                />
                <div style={styles.details}>
                  <h2 style={styles.name}>{player.name}</h2>
                  <p style={styles.victories}>{player.victorys} wins</p>
                  <div style={{ ...styles.animationBar, height: `${victoryBarHeights[player.id] || 0}rem` }}></div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.sectionRight}>
          {rightPlayers.map(player => (
            <div key={player.id} style={styles.player}>
              <img
                src={player.avatar_url}
                alt={player.name}
                style={styles.avatar}
              />
              <div style={styles.details}>
                <h2 style={styles.name}>{player.name}</h2>
                <p style={styles.victories}>{player.victorys} wins</p>
                <div style={{ ...styles.animationBar, height: `${victoryBarHeights[player.id] || 0}rem` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    boxSizing: 'border-box',
  },
  fileira: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    maxWidth: '1200px',
    margin: 'auto',
    gap: '50px',
  },
  sectionLeft: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'end',
    gap: '40px',
    width: '320px',
    padding: '1px',
    position: 'relative',
  },
  sectionCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'end',
    gap: '60px',
    flex: 1,
    padding: '1px',
    borderRadius: '10px',
    position: 'relative',
  },
  sectionRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'end',
    gap: '60px',
    width: '400px',
    padding: '1px',
    borderRadius: '10px',
    position: 'relative',
  },
  player: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '5px',
    border: '3px solid black',
  },
  details: {
    textAlign: 'center',
    color: '#000000',
  },
  name: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0',
  },
  victories: {
    fontSize: '15px',
    color: '#000000',
    fontWeight: 'bold',
    margin: '0',
    marginTop: '5px',
  },
  animationBar: {
    width: '70px',
    height: 0,
    backgroundColor: '#730065',
    transition: 'height 1s ease-in-out',
    marginTop: '5px',
  },
  crownGold: {
    position: 'absolute',
    top: '-47px',
    left: '34%',
    transform: 'translateX(-50%) rotate(-15deg)',
    width: '60px',
    height: 'auto',
  },
  crownSilver: {
    position: 'absolute',
    top: '-49px',
    left: '64%',
    transform: 'translateX(-50%) rotate(-10deg)',
    width: '60px',
    height: 'auto',
  },
  crownBronze: {
    position: 'absolute',
    top: '-45px',
    left: '27%',
    transform: 'translateX(-50%) rotate(10deg)',
    width: '60px',
    height: 'auto',
  },
};

export default Ranking;
