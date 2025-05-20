/**
 * 用户进度模块 - 管理用户积分和等级
 */
class UserProgress {
    constructor() {
        // 等级定义
        this.levels = [
            { name: '初学者', minPoints: 0, maxPoints: 49 },
            { name: '初级', minPoints: 50, maxPoints: 199 },
            { name: '中级', minPoints: 200, maxPoints: 499 },
            { name: '高级', minPoints: 500, maxPoints: 999 },
            { name: '专家', minPoints: 1000, maxPoints: 1999 },
            { name: '大师', minPoints: 2000, maxPoints: Infinity }
        ];
        
        // 从本地存储加载用户数据
        this.loadUserData();
    }
    
    /**
     * 加载用户数据
     */
    loadUserData() {
        const savedData = localStorage.getItem('englishLearningUserData');
        
        if (savedData) {
            const data = JSON.parse(savedData);
            this.points = data.points || 0;
            this.completedExercises = data.completedExercises || 0;
        } else {
            this.points = 0;
            this.completedExercises = 0;
        }
    }
    
    /**
     * 保存用户数据
     */
    saveUserData() {
        const data = {
            points: this.points,
            completedExercises: this.completedExercises
        };
        
        localStorage.setItem('englishLearningUserData', JSON.stringify(data));
    }
    
    /**
     * 获取当前积分
     * @returns {number} - 当前积分
     */
    getPoints() {
        return this.points;
    }
    
    /**
     * 添加积分
     * @param {number} points - 要添加的积分
     * @returns {Object} - 包含新积分和是否升级的信息
     */
    addPoints(points) {
        if (points <= 0) return { newPoints: this.points, levelUp: false };
        
        const oldLevel = this.getCurrentLevel();
        this.points += points;
        this.completedExercises += 1;
        
        // 保存数据
        this.saveUserData();
        
        // 检查是否升级
        const newLevel = this.getCurrentLevel();
        const levelUp = newLevel.name !== oldLevel.name;
        
        return {
            newPoints: this.points,
            levelUp,
            oldLevel,
            newLevel
        };
    }
    
    /**
     * 获取当前等级
     * @returns {Object} - 当前等级对象
     */
    getCurrentLevel() {
        for (const level of this.levels) {
            if (this.points >= level.minPoints && this.points <= level.maxPoints) {
                return level;
            }
        }
        return this.levels[0]; // 默认返回最低等级
    }
    
    /**
     * 获取下一级所需积分
     * @returns {number} - 升级所需的额外积分
     */
    getPointsToNextLevel() {
        const currentLevel = this.getCurrentLevel();
        const currentLevelIndex = this.levels.findIndex(level => level.name === currentLevel.name);
        
        // 如果已经是最高级别
        if (currentLevelIndex === this.levels.length - 1) {
            return Infinity;
        }
        
        const nextLevel = this.levels[currentLevelIndex + 1];
        return nextLevel.minPoints - this.points;
    }
    
    /**
     * 获取当前等级进度百分比
     * @returns {number} - 进度百分比 (0-100)
     */
    getLevelProgressPercentage() {
        const currentLevel = this.getCurrentLevel();
        
        // 如果是最高级别
        if (currentLevel.maxPoints === Infinity) {
            return 100;
        }
        
        const levelPoints = currentLevel.maxPoints - currentLevel.minPoints;
        const userLevelPoints = this.points - currentLevel.minPoints;
        
        return Math.min(100, Math.round((userLevelPoints / levelPoints) * 100));
    }
    
    /**
     * 重置用户进度
     */
    resetProgress() {
        this.points = 0;
        this.completedExercises = 0;
        this.saveUserData();
    }
}
